const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lifelink_secret_key_2024');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
