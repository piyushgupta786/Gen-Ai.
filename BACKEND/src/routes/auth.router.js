const express = require("express");
const authcontrollers = require('../controllers/auth.controller')
<<<<<<< HEAD
const authMiddleware = require('../Middlewares/auth.middleware')
=======
>>>>>>> de0216fdcb2be9d5a75226350dfd8a455a0dfb73

const authRouter = express.Router();

authRouter.post('/register' , authcontrollers.UserRegister )

authRouter.post('/login' , authcontrollers.loginUser )

<<<<<<< HEAD
authRouter.get('/logout' , authcontrollers.logoutUser )

authRouter.get('/Get-me', authMiddleware.authUser , authcontrollers.getme )

=======
>>>>>>> de0216fdcb2be9d5a75226350dfd8a455a0dfb73
module.exports= authRouter;     