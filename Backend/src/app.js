const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Fully Open dynamic configuration during critical launch tracking
app.use(cors({
    origin: function (origin, callback) {
        return callback(null, true); // Allow all production domains dynamically
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
}));

// Fallback mechanism to prevent jsonwebtoken from dropping execution if Render configuration sync fails
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "AI_JOB_PREP_SUPER_SECURE_FALLBACK_SECRET_KEY_JWT_123!!";
    console.log("⚠️ Warning: JWT_SECRET was missing on server environment, loaded emergency internal fallback key.");
}

// Base root check
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "AI Job Prep Backend is running successfully! 🚀",
        status: "Healthy",
        envCheck: process.env.JWT_SECRET ? "ACTIVE ✅" : "MISSING ❌"
    });
});

/* Require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* Using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Caught:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;