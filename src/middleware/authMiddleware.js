const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
          }

            const token = authHeader.split(' ')[1];

              try {
                  const isBlacklisted = await redis.get(`blacklist:${token}`);
                      if (isBlacklisted) {
                            return res.status(401).json({ error: 'Token has been revoked' });
                                }

                                    const payload = jwt.verify(token, JWT_SECRET);
                                        req.user = payload;
                                            next();
                                              } catch (err) {
                                                  if (err.name === 'TokenExpiredError') {
                                                        return res.status(401).json({ error: 'Token expired' });
                                                            }
                                                                return res.status(401).json({ error: 'Invalid token' });
                                                                  }
                                                                  };

                                                                  exports.authorize = (...roles) => {
                                                                    return (req, res, next) => {
                                                                        if (!req.user) {
                                                                              return res.status(401).json({ error: 'Unauthenticated' });
                                                                                  }
                                                                                      if (!roles.includes(req.user.role)) {
                                                                                            return res.status(403).json({ error: 'Insufficient permissions' });
                                                                                                }
                                                                                                    next();
                                                                                                      };
                                                                                                      };
                                                                                                      
                                                                                                      exports.rateLimitByUser = async (req, res, next) => {
                                                                                                        if (!req.user) return next();
                                                                                                          const key = `rate:${req.user.userId}`;
                                                                                                            const count = await redis.incr(key);
                                                                                                              if (count === 1) await redis.expire(key, 60);
                                                                                                                if (count > 100) {
                                                                                                                    return res.status(429).json({ error: 'Rate limit exceeded' });
                                                                                                                      }
                                                                                                                        next();
                                                                                                                        };
