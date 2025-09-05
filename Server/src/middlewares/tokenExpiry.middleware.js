import jwt from "jsonwebtoken";

const checkTokenExpiry = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next();
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return next();
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const ttlRaw = decoded.exp - nowSec;
    const ttlSec = Number.isFinite(ttlRaw) ? Math.max(0, Math.floor(ttlRaw)) : 0;
    const expDate = new Date(decoded.exp * 1000);

    req.tokenExpiry = {
      exp: decoded.exp,
      timeLeft: ttlSec,
      expiryDate: expDate,
      isExpired: ttlSec === 0,
    };

    res.set({
      'x-token-expiry': expDate.toISOString(),
      'x-token-ttl': String(ttlSec),
      'x-token-expired': ttlSec === 0 ? 'true' : 'false',
    });

    next();
  } catch (error) {
    next();
  }
};

export default checkTokenExpiry;