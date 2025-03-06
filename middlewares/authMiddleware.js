import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "Access Denied: No Token Provided" });

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'
  if (!token)
    return res
      .status(401)
      .json({ error: "Access Denied: Invalid Token Format" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or Expired Token" });
    req.user = user; // Store user details in req
    next();
  });
};

export default authenticateToken;
