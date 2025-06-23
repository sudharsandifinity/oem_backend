const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Please Login!' });

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(err){
                return res.status(403).json({ error: 'Invalid token!' })
            }
            req.user = decode;
            next();
        })
    } catch (err) {
            res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;