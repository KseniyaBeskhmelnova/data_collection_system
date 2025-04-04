const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        req.user = decoded;
        next();
    });
};
