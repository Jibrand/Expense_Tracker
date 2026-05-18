import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Check Authorization header if cookie is missing
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET || "test");

    req.user = decodedData;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
