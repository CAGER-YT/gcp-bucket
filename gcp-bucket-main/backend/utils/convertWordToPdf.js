const mammoth = require('mammoth');
const puppeteer = require('puppeteer');
const fs = require('fs');
const tmp = require('tmp');

/**
 * Convert a DOCX file (buffer) to PDF.
 * @param {Buffer} docxBuffer - The buffer of the DOCX file.
 * @returns {Promise<Buffer>} - The PDF file as a buffer.
 */
const convertWordToPdf = async (docxBuffer) => {
  try {
    // Step 1: Convert DOCX to HTML using Mammoth
    const { value: htmlContent } = await mammoth.convertToHtml({ buffer: docxBuffer });

    // Step 2: Use Puppeteer to convert HTML to PDF
    const pdfBuffer = await convertHtmlToPdf(htmlContent);

    return pdfBuffer;
  } catch (err) {
    console.error('Error during DOCX to PDF conversion', err);
    throw new Error('Error converting DOCX to PDF');
  }
};

/**
 * Convert HTML content to PDF using Puppeteer.
 * @param {string} htmlContent - The HTML content.
 * @returns {Promise<Buffer>} - The PDF file as a buffer.
 */
const convertHtmlToPdf = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content of the page to the HTML content
  await page.setContent(htmlContent);

  // Generate PDF from the page content
  const pdfBuffer = await page.pdf();

  await browser.close();

  return pdfBuffer;
};

module.exports = { convertWordToPdf };
