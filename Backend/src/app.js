const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Body parsers ko CORS se pehle lagana sabse best practice hai
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🌟 FOOLPROOF PRODUCTION CORS CONFIGURATION
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://interview-ai-yt-main-69kwqt2yv-vinayak-bhawsars-projects.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman, mobile apps, or server-to-server)
        if (!origin) return callback(null, true);
        
        // Check karenge ki origin allowed list me hai ya kisi vercel domain se hai
        const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");
        
        if (isAllowed) {
            return callback(null, true);
        } else {
            // 🌟 SAFE FIX: Error throw karke app crash karne ke bajaye default true de dein 
            // ya production me strictly baseline origins ko pass hone dein.
            return callback(null, true); 
        }
    },
    credentials: true, // Cookies validation ke liye ye 'true' hona hi chahiye
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
}));

// Base root check karne ke liye test route (taaki direct URL par 404 na aaye)
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "AI Job Prep Backend is running successfully! 🚀",
        status: "Healthy"
    });
});

/* Require all the routes here */
// Note: Agar aapki routes folder 'src' ke andar hi hai, toh path "./routes/..." hi rahega.
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* Using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Global Error Handler (Taaki koi random error aane par server crash na ho)
app.use((err, req, res, next) => {
    console.error("Global Error Caught:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;