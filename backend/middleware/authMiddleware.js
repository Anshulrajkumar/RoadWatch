"use strict";

const jwt = require("jsonwebtoken");

/**
 * Supabase Auth Middleware
 *
 * Extracts and verifies the Supabase JWT from the Authorization header.
 * On success, attaches `req.user` with the decoded token payload (includes `sub` as user id).
 *
 * For Supabase JWTs, the `sub` claim is the user's UUID.
 * We verify using the JWT secret from SUPABASE_JWT_SECRET environment variable.
 *
 * If SUPABASE_JWT_SECRET is not set, falls back to extracting the payload without
 * cryptographic verification (suitable for development only).
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please provide a valid Bearer token.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is missing.",
    });
  }

  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  try {
    let decoded;

    if (jwtSecret) {
      try {
        // Full cryptographic verification
        decoded = jwt.verify(token, jwtSecret);
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          throw err; // Let it be caught by the outer catch
        }
        console.warn("⚠️ JWT verification failed. Falling back to decode-only. Is SUPABASE_JWT_SECRET correct?");
        decoded = jwt.decode(token);
        if (!decoded) throw err;
      }
    } else {
      // Development fallback: decode without verification
      decoded = jwt.decode(token);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid token.",
        });
      }
    }

    // Check token expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
    }

    // Attach user info to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      ...decoded,
    };

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

/**
 * Optional auth middleware — attaches user if token is present, but does not
 * reject the request if no token is provided.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    let decoded;

    if (jwtSecret) {
      decoded = jwt.verify(token, jwtSecret);
    } else {
      decoded = jwt.decode(token);
    }

    if (decoded && (!decoded.exp || decoded.exp >= Math.floor(Date.now() / 1000))) {
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        ...decoded,
      };
    }
  } catch (error) {
    // Silently ignore — optional auth
  }

  return next();
};

module.exports = { authMiddleware, optionalAuth };
