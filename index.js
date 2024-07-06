const express = require("express");
const app = express();
const userRoutes = require("./routes/User");
const todoRoutes = require("./routes/Todo");
const connectDB = require("./config/db")
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB();

// Add middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/todos", todoRoutes);

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "Server is up and running",
    });
});

app.listen(PORT, () => {
    console.log(`Page is Running on PORT ${PORT}`);
});
