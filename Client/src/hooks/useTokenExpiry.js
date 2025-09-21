import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL, APIEndpoints } from '../services/api.jsx';

const ALERT_THRESHOLD_SEC = 600; // 10 นาที

const useTokenExpiry = (opts = {}) => {
  const pickRole = () =>
    (opts.role || localStorage.getItem('appRole') || 'auto').toLowerCase();

  const [showNotification, setShowNotification] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const hasShownNotification = useRef(false);

  const pollTimer = useRef(null);
  const tickTimer = useRef(null);
  const respIntId = useRef(null);

  const timeRemaining = Math.max(0, Math.ceil(secondsRemaining / 60));

  const stopAll = () => {
    if (pollTimer.current) { clearInterval(pollTimer.current); pollTimer.current = null; }
    if (tickTimer.current) { clearInterval(tickTimer.current); tickTimer.current = null; }
    if (respIntId.current !== null) {
      axios.interceptors.response.eject(respIntId.current);
      respIntId.current = null;
    }
  };

  const startTick = () => {
    if (tickTimer.current) return;
    tickTimer.current = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1));
    }, 1000);
  };

  const readTtlFromHeaders = (headers) => {
    const raw =
      headers?.['x-token-ttl'] ??
      headers?.['x-token-expires-in'] ??
      headers?.['x-token-ttl-sec'];
    const ttl = parseInt(raw, 10);
    return Number.isFinite(ttl) ? ttl : null;
  };

  const readTtlFromData = (data) => {
    if (data?.timeLeft != null) {
      const ms = Number(data.timeLeft);
      if (Number.isFinite(ms)) return Math.max(0, Math.floor(ms / 1000));
    }
    const expIso = data?.expiresIn || data?.expiry || data?.expires_at;
    if (expIso) {
      const diffSec = Math.floor((new Date(expIso).getTime() - Date.now()) / 1000);
      if (Number.isFinite(diffSec)) return Math.max(0, diffSec);
    }
    return null;
  };

  const getCandidates = () => {
    const role = pickRole();
    const path = (typeof window !== 'undefined' ? window.location.pathname : '')?.toLowerCase();
    const list = [];

    if (role === 'officer') {
      if (APIEndpoints?.officer?.logged) list.push(APIEndpoints.officer.logged);
    } else if (role === 'agency') {
      if (APIEndpoints?.agency?.logged) list.push(APIEndpoints.agency.logged);
    } else {
      if (path.includes('officer') && APIEndpoints?.officer?.logged) list.push(APIEndpoints.officer.logged);
      if (path.includes('agency')  && APIEndpoints?.agency?.logged)  list.push(APIEndpoints.agency.logged);
      if (APIEndpoints?.officer?.logged && !list.includes(APIEndpoints.officer.logged)) list.push(APIEndpoints.officer.logged);
      if (APIEndpoints?.agency?.logged  && !list.includes(APIEndpoints.agency.logged))  list.push(APIEndpoints.agency.logged);
    }

    return list.filter(Boolean);
  };

  const fetchAnyLogged = async () => {
    const candidates = getCandidates();

    for (const ep of candidates) {
      try {
        const res = await axios.get(API_BASE_URL + ep, { withCredentials: true });
        const ttlFromHeader = readTtlFromHeaders(res.headers);
        const ttlFromData = readTtlFromData(res.data);
        return { ttl: ttlFromHeader ?? ttlFromData ?? null };
      } catch (err) {
        const isExpired =
          err?.response?.data?.expired === true ||
          String(err?.response?.headers?.['x-token-expired'] || '').toLowerCase() === 'true';
        if (err?.response?.status === 401 && isExpired) throw err;
      }
    }

    const res = await axios.get(API_BASE_URL + APIEndpoints.auth.checkTokenExpiry, { withCredentials: true });
    const ttl = readTtlFromData(res.data);
    return { ttl: ttl ?? null };
  };

  const applyTtl = (ttlSec) => {
    const sec = Number.isFinite(ttlSec) ? Math.max(0, Math.floor(ttlSec)) : 0;
    setSecondsRemaining(sec);
    if (sec <= ALERT_THRESHOLD_SEC && !hasShownNotification.current) {
      setShowNotification(true);
      hasShownNotification.current = true;
      if (pollTimer.current) { clearInterval(pollTimer.current); pollTimer.current = null; }
    }
  };

  const syncFromServer = async () => {
    try {
      const { ttl } = await fetchAnyLogged();
      if (ttl != null) applyTtl(ttl);
      startTick();
    } catch (err) {
      const isExpired =
        err?.response?.data?.expired === true ||
        String(err?.response?.headers?.['x-token-expired'] || '').toLowerCase() === 'true';
      if (err?.response?.status === 401 && isExpired && !hasShownNotification.current) {
        setShowNotification(true);
        hasShownNotification.current = true;
      }
    }
  };

  const resetFlags = () => {
    setShowNotification(false);
    hasShownNotification.current = false;
  };

  const startSystem = () => {
    syncFromServer();
    pollTimer.current = setInterval(syncFromServer, 600000);

    respIntId.current = axios.interceptors.response.use(
      (response) => {
        const ttlFromHeader = readTtlFromHeaders(response.headers);
        const ttlFromData = readTtlFromData(response.data);
        const ttl = ttlFromHeader ?? ttlFromData;
        if (ttl != null) applyTtl(ttl);
        return response;
      },
      (error) => {
        const { response } = error || {};
        const isExpired =
          response?.data?.expired === true ||
          String(response?.headers?.['x-token-expired'] || '').toLowerCase() === 'true';
        if (response?.status === 401 && isExpired && !hasShownNotification.current) {
          setShowNotification(true);
          hasShownNotification.current = true;
        }
        return Promise.reject(error);
      }
    );
  };

  useEffect(() => {
    startSystem();
    return () => stopAll();
  }, []);

  const handleExtendToken = async () => {
    try {
      const res = await axios.post(
        API_BASE_URL + APIEndpoints.auth.refresh, 
        {},
        { withCredentials: true }
      );

      let ttl = readTtlFromHeaders(res.headers) ?? readTtlFromData(res.data);
      if (ttl == null) {
        const { ttl: fallbackTtl } = await fetchAnyLogged();
        ttl = fallbackTtl ?? 0;
      }

      stopAll();
      resetFlags();
      applyTtl(ttl);
      startSystem();
    } catch {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    stopAll();
    resetFlags();
    try {
      await axios.post(API_BASE_URL + APIEndpoints.auth.logout, {}, { withCredentials: true });
    } catch {}
    localStorage.removeItem('appRole');
    window.location.href = '/';
  };

  return {
    showNotification,
    timeRemaining,
    secondsRemaining,
    handleExtendToken,
    handleLogout,
  };
};

export default useTokenExpiry;
