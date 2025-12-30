import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import geminiResponse from './gemini.js';

const app = express();
app.use(cors({
    origin: "https://virtual-assistant-0o83.onrender.com",
    credentials: true
}));


const port = process.env.PORT || 3000;
app.use(express.json())
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", async(req,res) =>{
    let prompt = req.query.prompt;
    let data = await geminiResponse(prompt)
    res.json(data);
})

app.get("/", (req, res) => { res.send("Server is running!"); });

app.listen(port, () =>{
    connectDb();
    console.log(`Server is running or port ${port}`);
})
