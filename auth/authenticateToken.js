const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']; // JWT should be passed in Authorization header
    if (!token) return res.status(403).send('Token is required');
    
    jwt.verify(token.split(' ')[1], process.env.JWT_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user; // Attach user information to the request object
        next(); // Continue to the next middleware or route
    });
} 

module.exports = authenticateToken;