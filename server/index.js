const express = require("express"); 
const cors = require("cors"); 
const fs = require("fs"); 
const { PDFDocument } = require("pdf-lib");

const app = express(); 
app.use(cors()); 
app.use(express.json()); // Enable JSON body parsing for incoming requests

app.post("/api/cutpdf", async (req, res) => {
  try {
    // Load the PDF file using pdf-lib
    const pdfDoc = await PDFDocument.load(fs.readFileSync("abhay.pdf"));

    // Get all the pages of the PDF
    const pages = pdfDoc.getPages();

    // Initialize an empty array to store the pages to keep
    const pagesToKeep = [];

    // Parse the input from the client and get the page ranges
    const pagesInput = req.body.pagesInput;
    const pageRanges = pagesInput.split(",");
    for (let i = 0; i < pageRanges.length; i++) {
      const pageRange = pageRanges[i].split("-");
      const start = parseInt(pageRange[0], 10) - 1;
      const end = pageRange.length > 1 ? parseInt(pageRange[1], 10) : start;

      // Add the pages in the given range to the pagesToKeep array
      for (let j = start; j <= end; j++) {
        pagesToKeep.push(pages[j]);
      }
    }

    // Create a new PDF document to save the pages to keep
    const pdfDocToSave = await PDFDocument.create();

    // Copy the pages to keep from the original PDF to the new PDF document
    const copiedPages = await pdfDocToSave.copyPages(
      pdfDoc,
      pagesToKeep.map((page) => pdfDoc.getPages().indexOf(page))
    );
    copiedPages.forEach((copiedPage) => pdfDocToSave.addPage(copiedPage));

    // Save the new PDF document to a file
    const pdfBytes = await pdfDocToSave.save();
    fs.writeFileSync("updated.pdf", pdfBytes);

    // Send a success response to the client
    res.send("PDF cut and saved successfully");
  } catch (err) {
    console.log(err);
    // Send an error response to the client
    res.status(500).send("Internal server error");
  }
});

// Start the server and listen for incoming requests on port 5000
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
