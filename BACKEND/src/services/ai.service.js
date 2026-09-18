const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer")

const client = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportJsonSchema = {
    type: "object",
    properties: {
        matchScore: { type: "integer" },
        technicalQuestions: {
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
        behavioralQuestions: {
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
        skillGaps: {
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
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
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
    model: "gemini-3.5-flash-lite",
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


async function generateResumePdf({ resume, selfDescription, jobDescription }, retries = 3) {
   const prompt = `You are a strict and professional resume writer. Your task is to format and tailor the candidate's resume for the given job description using ONLY the provided facts.

Candidate Details:
Resume Data: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

CRITICAL RULES (STRICT COMPLIANCE REQUIRED):
1. DO NOT invent, hallucinate, or add any new projects, companies, experience, or certifications that are not present in the Resume Data.
2. DO NOT change the names of existing projects or employers. Keep them exactly as written.
3. You can rephrase, reorganize, and highlight relevant keywords from the existing data to match the Job Description, but the core facts must remain 100% truthful to the input.
4. The output must strictly be a JSON object containing a single key "html". The value of "html" must be a complete, beautifully structured HTML string with professional inline CSS/styling, optimized to look like a human-written resume when converted to a 1-2 page PDF.`;

    const resumePdfJsonSchema = {
        type: "object",
        properties: {
            html: { 
                type: "string", 
                description: "The complete, well-formatted HTML content of the tailored resume with inline styles, ready for PDF generation." 
            }
        },
        required: ["html"]
    };

    for (let i = 0; i < retries; i++) {
        try {
            const interaction = await client.interactions.create({
                model: "gemini-3.5-flash-lite",
                input: prompt,
                response_format: {
                    type: 'text',
                    mime_type: 'application/json',
                    schema: resumePdfJsonSchema
                }
            });

            const jsonContent = JSON.parse(interaction.output_text);
            const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
            return pdfBuffer;

        } catch (error) {
            // Agar rate limit lagti hai, to yeh automatic 6-12 seconds ka delay le legi
            if (error.status === 429 || error.message.includes("429") || error.message.includes("quota")) {
                const waitTime = (i + 1) * 6000;
                console.log(`⚠️ Rate limit hit during PDF generation. Retrying in ${waitTime / 1000}s...`);
                await sleep(waitTime);
                continue;
            }
            throw error;
        }
    }
    throw new Error("Gemini API rate limit exceeded for resume generation. Please wait 1 minute before retrying.");
}



module.exports = { generateInterviewReport , generateResumePdf }
