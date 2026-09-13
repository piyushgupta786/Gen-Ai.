const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod");



const ai = new GoogleGenAI({
    apiKey : process.env.GOOGLE_GENAI_API_KEY
});

async function generateInterviewReport({jobDescription,Resume,selfDescription}) {
    
}