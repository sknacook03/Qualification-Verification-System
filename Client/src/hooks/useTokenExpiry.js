import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL, APIEndpoints } from '../services/api.jsx';

const ALERT_THRESHOLD_SEC = 600;

const useTokenExpiry = () => {
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
      const res = await axios.get(API_BASE_URL + APIEndpoints.agency.logged, {
        withCredentials: true
      });
      const ttl = parseInt(res.headers['x-token-ttl'], 10);
      if (!Number.isNaN(ttl)) applyTtl(ttl);
      startTick(); 
    } catch (err) {
      if (err?.response?.status === 401 && !hasShownNotification.current) {
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
        const ttl = parseInt(response.headers?.['x-token-ttl'], 10);
        if (!Number.isNaN(ttl)) applyTtl(ttl);
        return response;
      },
      (error) => {
        if (error.response?.status === 401 && !hasShownNotification.current) {
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

      let ttl = parseInt(res.headers?.['x-token-ttl'], 10);

      if (Number.isNaN(ttl)) {
        await new Promise(r => setTimeout(r, 150));
        const chk = await axios.get(
          API_BASE_URL + APIEndpoints.agency.logged,
          { withCredentials: true }
        );
        ttl = parseInt(chk.headers?.['x-token-ttl'], 10);
      }

      stopAll();
      resetFlags();
      applyTtl(Number.isNaN(ttl) ? 0 : ttl);
      startSystem();
    } catch (e) {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    stopAll();
    resetFlags();
    try {
      await axios.post(API_BASE_URL + APIEndpoints.auth.logout, {}, { withCredentials: true });
    } catch {}
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
