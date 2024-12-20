const express = require('express');

const router = express.Router();

router.get("/downloads/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "files", `${fileName}.pdf`);

  res.download(filePath, (err) => {
    if (err) {
      console.error("File not found:", err);
      res.status(404).send("File not found!");
    }
  });
});
module.exports = router;
