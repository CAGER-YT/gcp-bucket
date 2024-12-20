const libre = require('libreoffice-convert');
const fs = require('fs');
const path = require('path');

// Function to convert DOCX to PDF
const convertWordToPdf = async (inputPath) => {
  try {
    const outputPath = path.join(path.dirname(inputPath), `${path.basename(inputPath, '.docx')}.pdf`);
    const input = fs.readFileSync(inputPath);

    return new Promise((resolve, reject) => {
      libre.convert(input, '.pdf', undefined, (err, result) => {
        if (err) {
          reject(err);
        } else {
          fs.writeFileSync(outputPath, result);
          resolve(fs.readFileSync(outputPath));
        }
      });
    });
  } catch (error) {
    throw new Error(`Error converting DOCX to PDF: ${error.message}`);
  }
};

module.exports = { convertWordToPdf };
