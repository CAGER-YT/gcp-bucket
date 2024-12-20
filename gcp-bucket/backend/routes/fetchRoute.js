const express = require("express");
const { bucket } = require("../config/gcpConfig");

const router = express.Router();

router.get("/latest", async (req, res) => {
    try {
        const [files] = await bucket.getFiles();
        const latestFile = files.sort((a, b) => b.metadata.timeCreated.localeCompare(a.metadata.timeCreated))[0];

        if (!latestFile) {
            return res.status(404).json({ message: "No files found" });
        }

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${latestFile.name}`;
        res.status(200).json({ file: latestFile.name, url: publicUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch files", error });
    }
});

module.exports = router;
