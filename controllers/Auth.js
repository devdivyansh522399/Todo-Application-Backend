const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();


// Signup Handler
exports.signup = async(req, res) => {
    try{
        // Fetch data from req.body
        const {
            firstName,
            lastName,
            email,
            password,
        } = req.body;


        // Validate
        if(!firstName || !lastName || !email || !password ){
            return res.status(401).json({
                success: false,
                message: "All Fields Are Required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success: false,
                message: "User Already Exists",
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        // Return res
        return res.status(200).json({
            success: true,
            message: "User Is Registered Successfully",
            user,
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


// Login Handler
exports.login = async(req, res) => {
    try{

        // Fetch data from req body
        const {
            email,
            password,
        } = req.body;

        // Validate
        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: "Input Fields Are Required",
            });
        }

        // Check if User Present or not
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is Not Signed Up",
            });
        }

        // Compare Pass
        if(await bcrypt.compare(password, user.password)){

            const payload = {
                email: user.email,
                id: user._id,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            // Create Cookie and Send Response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged In Successfully",
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Password is Incorrect",
            });
        }
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}