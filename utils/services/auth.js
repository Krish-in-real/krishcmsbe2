const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(email) {
  const payload = { email };

  const secretKey = process.env.JWT_SECRET_KEY;

  const token = jwt.sign(payload, secretKey);

  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Payload:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

module.exports = { verifyToken, generateToken };
