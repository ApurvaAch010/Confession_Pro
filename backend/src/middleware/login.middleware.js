import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
import AppErr from "../exception/error.js";
import pool from "../config/database.connection.js";

const LoginCheck = async (req, res, next) => {
  try {
    let token = req.headers['authorization']?.split(" ").pop();
    if (!token) throw new AppErr({ message: "Token required", code: 401 });

    const data = jwt.verify(token, process.env.JWT_TOKEN);
    if (data.type === 'refresh') {
      throw new AppErr({ message: "Use access token", code: 401 });
    }

    pool.query(
      'SELECT * FROM users WHERE access_token = ?',
      [token],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(502).json({ error: "Database error" });
        }
        
        if (result.length === 0) {
          return res.status(401).json({ error: "Invalid token" });
        }

        req.user = result[0];
        next();
      }
    );
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid/expired token" });
    }
    res.status(err.code || 500).json({ error: err.message || "Server error" });
  }
};

export default LoginCheck