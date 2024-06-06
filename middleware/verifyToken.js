const jwt = require("jsonwebtoken");

const verify = function (req, res, next) {
  const token = req.header("token");
  // console.log(token)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const user = jwt.verify(token, "aBcDeFgH123");
    req.user = user;
    // console.log(req.user)
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
module.exports = verify