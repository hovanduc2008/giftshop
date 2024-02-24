const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    // const authHeader = req.headers.authorization || req.headers.Authorization; // Bearer Token
    // if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    // const token = authHeader.split(" ")[1];

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //     if (err) return res.sendStatus(403); // Invalid Token
    //     req.user = decoded.UserInfo.username;
    //     req.roles = decoded.UserInfo.roles;
    //     req.user_id = decoded.UserInfo.user_id;
    //     next();
    // });

    next();
};

module.exports = verifyJWT;
