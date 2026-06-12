require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

// Database connect karenge
connectToDB();

// Render environment variable se port uthayega, local par 3000 chalega
const PORT = process.env.PORT || 3000;

// 0.0.0.0 binding ensure karegi ki Render network ise block na kare
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});