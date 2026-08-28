const jwt = require("jsonwebtoken")
const blacklistTokenModel = require('../models/blacklist.model')


 async function authUser(req,res, next){

    const token = req.cookies.token

    if(!token){
        res.status(401).json({
            message :" token has not provided by the User"
        })
    }

    const isTokenBlacklisted = await blacklistTokenModel.findOne({token})

    if(isTokenBlacklisted){
        return res.status(401).json({
            message : " token invalid"
        })
    }

    
    try{

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY )

    req.user = decoded

    next()
    
    } catch( err ){
        res.status(401).json({
            message: " token is invalid "
        })
    } 
    

}

module.exports = {authUser}