// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { uploadToGCP } = require('../utils/gcpStorage'); // Assuming you have a utility to handle GCP upload

// const router = express.Router();

// // Multer setup for in-memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// // Handle file upload
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: 'No file uploaded' });
//     }

//     const file = req.file;
//     const filename = file.originalname;

//     // Upload the file directly to Google Cloud Storage
//     const fileUrl = await uploadToGCP(file.buffer, filename);
//     return res.status(200).json({ message: 'File uploaded successfully', fileUrl });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message || 'Error uploading file' });
//   }
// });

// module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { uploadToGCP } = require('../utils/gcpStorage'); // Utility to handle GCP upload
// const fs = require('fs');
// const pdfParse = require('pdf-parse'); // For parsing PDF content
// const mammoth = require('mammoth'); // For converting DOCX to text
// const { convertWordToPdf } = require('../utils/wordToPdf'); // Assuming you have a utility to convert DOCX to PDF

// const router = express.Router();

// // Multer setup for in-memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// // Function to check if a PDF contains text
// const containsTextInPdf = async (buffer) => {
//   try {
//     const data = await pdfParse(buffer);
//     return data.text && data.text.trim().length > 0;
//   } catch (err) {
//     throw new Error('Error reading PDF content');
//   }
// };

// // Function to check if a DOCX contains text
// const containsTextInDocx = async (buffer) => {
//   try {
//     const { value } = await mammoth.extractRawText({ buffer });
//     return value && value.trim().length > 0;
//   } catch (err) {
//     throw new Error('Error reading DOCX content');
//   }
// };

// // Handle file upload
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: 'No file uploaded' });
//     }

//     const file = req.file;
//     const filename = file.originalname;
//     const fileExtension = path.extname(filename).toLowerCase();

//     // Validate file type and check content
//     let validContent = false;

//     if (fileExtension === '.pdf') {
//       // If the file is PDF, check if it has content
//       validContent = await containsTextInPdf(file.buffer);
//     } else if (fileExtension === '.doc' || fileExtension === '.docx') {
//       // If the file is DOC/DOCX, convert it to PDF and check content
//       const pdfBuffer = await convertWordToPdf(file.buffer); // Assuming you have a function for this
//       validContent = await containsTextInPdf(pdfBuffer);
//     } else {
//       return res.status(400).send({ message: 'Invalid file type. Only PDF and DOC/DOCX are allowed.' });
//     }

//     if (!validContent) {
//       return res.status(400).send({ message: 'The file does not contain valid text content.' });
//     }

//     // Upload the file (PDF or converted PDF) to Google Cloud Storage
//     const fileUrl = await uploadToGCP(file.buffer, filename);
//     return res.status(200).json({ message: 'File uploaded successfully', fileUrl });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message || 'Error uploading file' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { uploadToGCP } = require('../utils/gcpStorage'); // Utility to handle GCP upload
// const fs = require('fs');
// const tmp = require('tmp'); // Temporary file handling
// const pdfParse = require('pdf-parse'); // For parsing PDF content
// const mammoth = require('mammoth'); // For converting DOCX to text
// const { convertWordToPdf } = require('../utils/wordToPdf'); // Utility to convert DOCX to PDF

// const router = express.Router();

// // Multer setup for in-memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// // Function to check if a PDF contains text
// const containsTextInPdf = async (buffer) => {
//   try {
//     const data = await pdfParse(buffer);
//     return data.text && data.text.trim().length > 0;
//   } catch (err) {
//     throw new Error('Error reading PDF content');
//   }
// };

// // Function to check if a DOCX contains text
// const containsTextInDocx = async (buffer) => {
//   try {
//     const { value } = await mammoth.extractRawText({ buffer });
//     return value && value.trim().length > 0;
//   } catch (err) {
//     throw new Error('Error reading DOCX content');
//   }
// };

// // Handle file upload
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: 'No file uploaded' });
//     }

//     const file = req.file;
//     const filename = file.originalname;
//     const fileExtension = path.extname(filename).toLowerCase();

//     let validContent = false;
//     let fileBuffer = file.buffer;

//     if (fileExtension === '.pdf') {
//       // If the file is PDF, check if it has content
//       validContent = await containsTextInPdf(fileBuffer);
//     } else if (fileExtension === '.doc' || fileExtension === '.docx') {
//       // If the file is DOC/DOCX, convert it to PDF and check content
//       const tempDir = tmp.dirSync({ unsafeCleanup: true }); // Create a temp directory for conversion
//       const tempFilePath = path.join(tempDir.name, filename);

//       // Save the DOCX file to the temporary directory
//       fs.writeFileSync(tempFilePath, file.buffer);

//       const pdfBuffer = await convertWordToPdf(tempFilePath); // Convert DOCX to PDF

//       // Check the content of the PDF
//       validContent = await containsTextInPdf(pdfBuffer);

//       // Clean up the temporary directory
//       tempDir.removeCallback();
//       fileBuffer = pdfBuffer; // Update file buffer with the converted PDF
//     } else {
//       return res.status(400).send({ message: 'Invalid file type. Only PDF and DOC/DOCX are allowed.' });
//     }

//     if (!validContent) {
//       return res.status(400).send({ message: 'The file does not contain valid text content.' });
//     }

//     // Upload the file (PDF or converted PDF) to Google Cloud Storage
//     const fileUrl = await uploadToGCP(fileBuffer, filename);

//     return res.status(200).json({ message: 'File uploaded successfully', fileUrl });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message || 'Error uploading file' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const mammoth = require('mammoth');
// const pdfParse = require('pdf-parse');
// const puppeteer = require('puppeteer');
// const { uploadToGCP } = require('../utils/gcpStorage'); // Assuming you have a utility to handle GCP upload

// const router = express.Router();

// // Multer setup for in-memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// // Helper function to check if the file contains 'test' text in a PDF
// async function containsTestInPDF(pdfBuffer) {
//   const data = await pdfParse(pdfBuffer);
//   return data.text.toLowerCase().includes('test');
// }

// // Helper function to convert DOCX to PDF
// async function convertDocxToPDF(docxBuffer) {
//   // Convert DOCX to HTML using mammoth
//   const result = await mammoth.convertToHtml({ buffer: docxBuffer });
//   const html = result.value;

//   // Convert HTML to PDF using puppeteer
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(html);
//   const pdfBuffer = await page.pdf(); // Generate the PDF buffer
//   await browser.close();

//   return pdfBuffer; // Return the PDF buffer
// }

// // Handle file upload
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: 'No file uploaded' });
//     }

//     const file = req.file;
//     const filename = file.originalname;
//     const fileBuffer = file.buffer;
//     const fileExtension = path.extname(filename).toLowerCase();

//     let fileToUpload = fileBuffer;

//     // Check file type and process accordingly
//     if (fileExtension === '.pdf') {
//       // Check for 'test' content in PDF
//       if (!(await containsTestInPDF(fileBuffer))) {
//         return res.status(400).send({ message: 'PDF does not contain required content ("test")' });
//       }
//     } else if (fileExtension === '.doc' || fileExtension === '.docx') {
//       // Convert DOCX to PDF and check for content
//       fileToUpload = await convertDocxToPDF(fileBuffer);
//     } else {
//       return res.status(400).send({ message: 'Invalid file type. Only PDF and Word documents are allowed.' });
//     }

//     // Upload the (possibly converted) file directly to Google Cloud Storage
//     const fileUrl = await uploadToGCP(fileToUpload, filename.replace(fileExtension, '.pdf')); // Ensure the filename ends with .pdf
//     return res.status(200).json({ message: 'File uploaded successfully', fileUrl });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message || 'Error uploading file' });
//   }
// });

// module.exports = router;






const express = require('express');
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const puppeteer = require('puppeteer');
const { uploadToGCP } = require('../utils/gcpStorage'); // Assuming you have a utility to handle GCP upload

const router = express.Router();

// Multer setup for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Helper function to check if the file contains 'test' text in a PDF
async function containsTestInPDF(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  return data.text.toLowerCase().includes('test');
}

// Helper function to convert DOCX to PDF using puppeteer
async function convertDocxToPDF(docxBuffer) {
  // Convert DOCX to HTML using mammoth
  const result = await mammoth.convertToHtml({ buffer: docxBuffer });
  const html = result.value;

  // Convert HTML to PDF using puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf(); // Generate the PDF buffer
  await browser.close();

  return pdfBuffer; // Return the PDF buffer
}

// Handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    const file = req.file;
    const filename = file.originalname;
    const fileBuffer = file.buffer;
    const fileExtension = path.extname(filename).toLowerCase();

    let fileToUpload = fileBuffer;

    // Check file type and process accordingly
    if (fileExtension === '.pdf') {
      // Check for 'test' content in PDF
      if (!(await containsTestInPDF(fileBuffer))) {
        return res.status(400).send({ message: 'PDF does not contain required content ("test")' });
      }
    } else if (fileExtension === '.doc' || fileExtension === '.docx') {
      // Convert DOCX to PDF and check for content
      fileToUpload = await convertDocxToPDF(fileBuffer);
    } else {
      return res.status(400).send({ message: 'Invalid file type. Only PDF and Word documents are allowed.' });
    }

    // Upload the (possibly converted) file directly to Google Cloud Storage
    const fileUrl = await uploadToGCP(fileToUpload, filename.replace(fileExtension, '.pdf')); // Ensure the filename ends with .pdf
    return res.status(200).json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Error uploading file' });
  }
});

module.exports = router;
