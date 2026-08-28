const express = require("express");
const authcontrollers = require('../controllers/auth.controller')
const authMiddleware = require('../Middlewares/auth.middleware')

const authRouter = express.Router();

authRouter.post('/register' , authcontrollers.UserRegister )

authRouter.post('/login' , authcontrollers.loginUser )

authRouter.get('/logout' , authcontrollers.logoutUser )

authRouter.get('/Get-me', authMiddleware.authUser , authcontrollers.getme )

module.exports= authRouter;     