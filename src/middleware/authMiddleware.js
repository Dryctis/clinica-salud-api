// server/src/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

// This middleware verifies the JWT from the 'Authorization' header
const authMiddleware = (req, res, next) => {
  // Check if the 'Authorization' header exists
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token not provided or is invalid' });
  }

  // Extract the token (removing the "Bearer " part)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key from environment variables
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the decoded user information to the request object
    // This allows the route handlers to access the user's ID and role
    req.user = decodedToken;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid or has expired, return an error
    console.error('JWT verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export { authMiddleware };
