const mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type : String,
        required:[true , "Technical Question is required"]
    },
    intention:{
        type: String,
        required:[true , "Intention are required"]
    },
    answer:{
        type: String,
        required:[true, "Answer is required"]
    }
    
} , {
    _id : false, 
})

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type : String,
        required:[true , "Behaviour Question is required"]
    },
    intention:{
        type: String,
        required:[true , "Intention are required"]
    },
    answer:{
        type: String,
        required:[true, "Answer is required"]
    }
    
} , {
    _id : false, 
})

const skillGapSchema = new mongoose.Schema({
    skills:{
        type: String,
        required:[true, " Skills are required"],
    },
    severity:{
        type: String,
        enum: ["low","medium","high"],
        required:[true, "Severity is required"]
    },
},{
    _id: false,
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true , "Days are required"],
    },
    focus:{
        type: String,
        required: [true , "Focus is required"],
    },
    task:{
        type: String,
        required: [true , "Task is required"],
    },

})

const interviewReportSchema = new mongoose.Schema({
    jobDescription : {
        type : String,
        required: [ true , " Job description is required"]
    },
    Resume : {
        type : String,
    },
    selfDescription : {
        type : String,
    },
    matchScore : {
        type : Number,
        min : 0,
        max : 100,
    },
    technicalQuestion : [ technicalQuestionSchema ],
    behavioralQuestion : [ behavioralQuestionSchema ],
    skillGap : [skillGapSchema],
    preparationPlan : [ preparationPlanSchema]
}, {
    timestamps : true 
})