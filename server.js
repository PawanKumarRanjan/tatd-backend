// server.js
import express from 'express';
import cors from "cors";
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

connectDB()

app.use(cors());
app.use(express.json({ limit: "10mb" })); // increase payload limit for base64 images

// Routes
app.use("/api", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Auth Backend Running");
});

app.listen(PORT, () => console.log("Server Started At", PORT))
