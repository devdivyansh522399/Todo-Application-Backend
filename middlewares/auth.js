const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();


// auth
exports.auth = async(req, res, next) => {
    try{

        // Extract Token
        const token = req.cookies.token ||
                req.body.token ||
                req.headers.authorization && req.headers.authorization.replace("Bearer ", "");
        if(!token){
            return res.status(402).json({
                success: false,
                message: "Token is missing"
            });
        }

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        });
    }
}