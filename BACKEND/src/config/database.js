const mongoose = require("mongoose");


async function connectDB() {
    try {
         await mongoose.connect(process.env.MONGO_URI)

    console.log("connected to Database");
    } catch (error) {
        
        console.log("NOT connected to db" , error);
    }
    

}

module.exports= connectDB;