const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const token = req.header('Authorization');
    // if token valid or not

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, token is missing' });

    }
    try {
        jwt.verify(token, "ACCESS_TOKEN_SECRET", (err, decodedPayload) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.userId = decodedPayload.userId;
            next();
        });


    } catch (error) {
        res.status(401).json({ message: 'Unauthorized, invalid token' });

    }


}
module.exports = authMiddleware;
