const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

// 🌟 CORS CONFIGURATION: Localhost aur aapka Deployed Vercel URL dono allow honge
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://interview-ai-yt-main-gamma.vercel.app/" // 👈 YAHAN APNA VERCEL FRONTEND URL DAAL DENA!
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman, mobile apps or server-to-server)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Base root check karne ke liye test route (SABHI BRACKETS CLOSED PROPERLY 💥)
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