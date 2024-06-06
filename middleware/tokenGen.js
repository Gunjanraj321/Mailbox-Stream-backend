const jwt = require('jsonwebtoken');

const generateToken = (payload, secret, expiresIn = '1h') => {
  return jwt.sign(payload, "aBcDeFgH123", { expiresIn });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
