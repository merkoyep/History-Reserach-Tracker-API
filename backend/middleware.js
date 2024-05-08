const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

function authenticateToken(req, res, next) {
  const token = req.cookies ? req.cookies.jwt : undefined;

  if (!token) {
    return res.sendStatus(401); // if there's no token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JQT Verification Error:', err);
      return res.sendStatus(403); // if the token is invalid or expired
    }
    req.user = decoded;
    res.locals.currentUser = decoded;
    next();
  });
}

function authenticateTokenTesting(req, res, next) {
  req.user = { id: 123, username: 'testuser' };

  next();
}
function optionalAuthenticateToken(req, res, next) {
  const token = req.cookies ? req.cookies.jwt : undefined;

  if (!token) {
    return next(); // No token present, continue without setting req.user
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      req.user = decoded;
    }
    next(); // Continue regardless of token validity
  });
}
module.exports = {
  authenticateToken,
  optionalAuthenticateToken,
  authenticateTokenTesting,
};
