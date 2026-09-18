const pdfParse = require("pdf-parse")
const interviewReportModel = require("../models/interviewReport.model")
const {generateInterviewReport , generateResumePdf} = require("../services/ai.service")


async function generateInterViewReportController(req, res) {

    let resumeContent = { text: "" }

if (req.file) {
    const parser = new pdfParse.PDFParse({ data: req.file.buffer })
    resumeContent = await parser.getText()
    await parser.destroy()   // cleanup, memory leak se bachne ke liye
}

const { selfDescription, jobDescription } = req.body

const hasResume = resumeContent.text && resumeContent.text.trim().length >= 50
const hasSelfDescription = selfDescription && selfDescription.trim().length >= 20

if (!hasResume && !hasSelfDescription) {
    return res.status(400).json({
        message: "Either a Resume or a Self Description is required to generate a report."
    })
}

     const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    //console.log("=== AI RESPONSE FROM GEMINI ===", interViewReportByAi);

     const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

    

}


async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = {generateInterViewReportController , getInterviewReportByIdController , getAllInterviewReportsController , generateResumePdfController}