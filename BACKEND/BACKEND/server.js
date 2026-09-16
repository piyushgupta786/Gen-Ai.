require("dotenv").config();
const connectDB = require('./src/config/database');
const app = require('./src/app');


connectDB();

app.listen(3000 , ()=> {
    console.log("server running on port 3000");
});

