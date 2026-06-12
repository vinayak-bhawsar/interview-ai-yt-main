const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

// 🌟 DYNAMIC PRODUCTION CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://interview-ai-yt-main-69kwqt2yv-vinayak-bhawsars-projects.vercel.app" // Aapka exact Vercel url
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or server-to-server)
        if (!origin) return callback(null, true);
        
        // Agar dynamic branch/preview URL ho toh vercel.app check kar lega, ya exact match check karega
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS Policy Blocked this origin'), false);
        }
    },
    credentials: true, // Yeh 'true' header bhejna compulsory hai cookies ke liye
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// Base root check karne ke liye test route
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "AI Job Prep Backend is running successfully! 🚀",
        status: "Healthy"
    });
});

/* Require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* Using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;