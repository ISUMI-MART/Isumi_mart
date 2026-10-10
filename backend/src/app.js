import "dotenv/config";
import express from "express";
import globalRouter from "./routes/index.js";
import cors from "cors";

const app = express();

const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());

const allowOrigins = [
    "http://localhost:3000",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use("/api", globalRouter)

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on 🚀 http://localhost:${PORT}`);
});