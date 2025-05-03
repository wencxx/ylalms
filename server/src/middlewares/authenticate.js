const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']; 

  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).send(`Access denied. No token provided.`, );

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decodedToken.id; 
    next();
  } catch (err) {
    return res.status(403).send('Invalid or expired token.');
  }
};

module.exports = authenticateToken;
