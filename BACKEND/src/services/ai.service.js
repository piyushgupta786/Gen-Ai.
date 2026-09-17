const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer")

const client = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportJsonSchema = {
    type: "object",
    properties: {
        matchScore: { type: "integer" },
        technicalQuestion: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestion: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGap: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skills: { type: "string" },
                    severity: { 
                        type: "string", 
                        enum: ["low", "medium", "high"],
                        description: "Must be strictly lowercase string: 'low', 'medium', or 'high'"
                    }
                },
                required: ["skills", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "integer" },
                    focus: { type: "string" },
                    task: { 
                        type: "string", 
                        description: "A single detailed string listing the tasks for the day. DO NOT return an array."
                    }
                },
                required: ["day", "focus", "task"]
            }
        },
        title: { type: "string" }
    },
    required: ["matchScore", "technicalQuestion", "behavioralQuestion", "skillGap", "preparationPlan", "title"]
};

// Rate limit handling ke liye ek utility function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateInterviewReport({ resume, selfDescription, jobDescription }, retries = 3) {
    const prompt = `Generate a comprehensive interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}. 
                        
                        CRITICAL INSTRUCTIONS FOR OUTPUT FORMAT:
                        1. For 'preparationPlan.task', strictly return a single combined text string containing all tasks. Do not use an array format.
                        2. For 'skillGap.severity', strictly return only lowercase values: 'low', 'medium', or 'high'. Do not capitalize the first letter.`;

    for (let i = 0; i < retries; i++) {
        try {
            const interaction = await client.interactions.create({
                model: "gemini-3.8-flash",
                input: prompt,
                response_format: {
                    type: 'text',
                    mime_type: 'application/json',
                    schema: interviewReportJsonSchema
                }
            });

            return JSON.parse(interaction.output_text);
        } catch (error) {
            // Agar Rate Limit (429) ya Quota fail error aata hai, toh yeh thoda intezar karega
            if (error.status === 429 || error.message.includes("429") || error.message.includes("quota")) {
                const waitTime = (i + 1) * 6000; // Pehli baar 6s, fir 12s ka automatic wait
                console.log(`⚠️ Rate limit hit. Automatic retry in ${waitTime / 1000} seconds... (Attempt ${i + 1}/${retries})`);
                await sleep(waitTime);
                continue;
            }
            throw error;
        }
    }
    throw new Error("Gemini API Rate Limit lagatar exceed ho rahi hai. Kripya 1 minute baad dobara try karein.");
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
   const prompt = `You are an expert human resume writer and career coach. Your task is to format and tailor the candidate's resume for the given job description using ONLY the provided facts.

Candidate Details:
Resume Data: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

STRICT TRUTHFULNESS RULES:
1. DO NOT invent, hallucinate, or add any new projects, companies, experience, or certifications that are not present in the Resume Data.
2. DO NOT change the names of existing projects or employers. Keep them exactly as written.
3. Use ONLY the existing facts, but you can reorganize and emphasize keywords that match the Job Description.

HUMAN-LIKE TONE & WRITING RULES (NO AI-FLUFF):
1. Write the resume content in a highly professional, human-written tone. Avoid typical AI buzzwords and generic fluff (e.g., avoid "testament to", "spearheaded a paradigm shift", "delivering unparalleled results").
2. Use strong, industry-standard human action verbs (e.g., "Built", "Optimized", "Resolved", "Implemented") and clear, impact-driven metric statements.
3. Ensure the sentence structures vary naturally, just like an experienced professional recruiter would write it.
4. The output must strictly be a JSON object containing a single key "html". The value of "html" must be a complete, beautifully structured HTML string with professional inline CSS/styling, optimized to look like a human-written resume when converted to a 1-2 page PDF.`;

    // Bilkul generateInterviewReport ki tarah native JSON Schema standard format
    const resumePdfJsonSchema = {
        type: "object",
        properties: {
            html: { 
                type: "string", 
                description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer." 
            }
        },
        required: ["html"]
    };

    // Client Interactions API standard standard for modern Gemini SDK
    const interaction = await client.interactions.create({
        model: "gemini-3.8-flash",
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: resumePdfJsonSchema
        }
    });

    const jsonContent = JSON.parse(interaction.output_text);

    // HTML content ko text variable se puppeteer logic ke paas pass kiya
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}


module.exports = { generateInterviewReport , generateResumePdf }
