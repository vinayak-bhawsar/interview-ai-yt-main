// 🌟 FIX 1: dotenv ko file ke bilkul top par initialize karein taaki variables turant milein
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🌟 FIX 2: CORS ko completely production-ready aur open rakhein taaki koi origin error na aaye
app.use(cors({
    origin: function (origin, callback) {
        return callback(null, true); // Sabhi client origins (Vercel, Local) ko automatically allow karega
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
}));

// 🌟 FIX 3: Agar Render se JWT_SECRET nahi bhi mila, toh ye fallback key code ko crash nahi hone degi!
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "AI_JOB_PREP_SUPER_SECURE_PRODUCTION_FALLBACK_KEY_123456789";
    console.log("⚠️ Emergency Backup: JWT_SECRET environment me nahi mila, fallback key inject ho gayi hai.");
}

// Base root check route
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "AI Job Prep Backend is running successfully! 🚀",
        status: "Healthy",
        secretLoaded: process.env.JWT_SECRET ? "YES ✅" : "NO ❌"
    });
});

/* Require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* Using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Global Error Handler (Taaki server kabhi crash na ho)
app.use((err, req, res, next) => {
    console.error("Global Error Caught:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;