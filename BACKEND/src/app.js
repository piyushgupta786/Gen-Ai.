const express = require("express");
<<<<<<< HEAD
const cookieParser = require("cookie-parser")

const authRouter =require('./routes/auth.router')

const app = express();
app.use(cookieParser());
=======
const authRouter =require('./routes/auth.router')

const app = express();

>>>>>>> de0216fdcb2be9d5a75226350dfd8a455a0dfb73

app.use(express.json());
app.use("/api/auth/", authRouter);


module.exports= app;
