const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { bucket } = require("../config/gcpConfig");
const docxToPdf = require("docx-pdf");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload and convert file
router.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileId = uuidv4();
        const fileName = file.originalname;

        // Check if file is empty
        if (file.size === 0) {
            return res.status(400).json({ message: "Uploaded file is empty" });
        }

        // Convert Word to PDF or upload directly
        if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const convertedFilePath = `/tmp/${fileId}.pdf`;

            docxToPdf.convert(file.buffer, convertedFilePath, async (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "File conversion failed", error: err });
                }

                await bucket.upload(result.output, { destination: `${fileId}.pdf` });
                res.status(200).json({ message: "File converted and uploaded", fileId: `${fileId}.pdf` });
            });
        } else if (file.mimetype === "application/pdf") {
            const gcpFile = bucket.file(`${fileId}.pdf`);
            await gcpFile.save(file.buffer);
            res.status(200).json({ message: "PDF uploaded successfully", fileId: `${fileId}.pdf` });
        } else {
            res.status(400).json({ message: "Unsupported file type" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
});

module.exports = router;
