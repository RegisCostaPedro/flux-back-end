// src/services/auth-service.js
var jwt = require("jsonwebtoken");
var AuthService = class _AuthService {
  static generateToken = async (data) => {
    const TokenExpirationTime = "1d";
    return jwt.sign(data, global.SALT_KEY, { expiresIn: TokenExpirationTime });
  };
  static decodeToken = async (token) => {
    try {
      return await jwt.verify(token, global.SALT_KEY);
    } catch (error) {
      throw new Error("Token inv\xE1lido ou expirado.");
    }
  };
  static authorize = async (req, res, next) => {
    try {
      const token = req.body.token || req.query.token || req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ message: "Acesso restrito: token n\xE3o fornecido." });
      }
      await _AuthService.decodeToken(token);
      next();
    } catch (error) {
      res.status(401).json({ message: "Token inv\xE1lido ou expirado." });
    }
  };
  static isAdmin = async (req, res, next) => {
    try {
      const token = req.body.token || req.query.token || req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ message: "Acesso restrito: token n\xE3o fornecido." });
      }
      const decoded = await _AuthService.decodeToken(token);
      if (decoded.roles && decoded.roles.includes("admin")) {
        next();
      } else {
        res.status(403).json({ message: "Acesso restrito: administrador necess\xE1rio." });
      }
    } catch (error) {
      res.status(401).json({ message: "Token inv\xE1lido ou expirado." });
    }
  };
};
module.exports = AuthService;
