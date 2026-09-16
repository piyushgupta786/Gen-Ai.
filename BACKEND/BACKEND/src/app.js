const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors")

const authRouter =require('./routes/auth.router')

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "https//localhost:5173",
    credentials: true
}))

app.use("/api/auth/", authRouter);


module.exports= app;
