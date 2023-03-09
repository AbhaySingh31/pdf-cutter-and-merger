
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/cutpdf", async (req, res) => {
  try {
    const pdfDoc = await PDFDocument.load(fs.readFileSync("abhay.pdf"));
    const pages = pdfDoc.getPages();

    const pagesToKeep = [];
    const pagesInput = req.body.pagesInput;
    const pageRanges = pagesInput.split(",");
    for (let i = 0; i < pageRanges.length; i++) {
      const pageRange = pageRanges[i].split("-");
      const start = parseInt(pageRange[0], 10) - 1;
      const end = pageRange.length > 1 ? parseInt(pageRange[1], 10) : start;
      for (let j = start; j <= end; j++) {
        pagesToKeep.push(pages[j]);
      }
    }

    const pdfDocToSave = await PDFDocument.create();
    const copiedPages = await pdfDocToSave.copyPages(
      pdfDoc,
      pagesToKeep.map((page) => pdfDoc.getPages().indexOf(page))
    );
    copiedPages.forEach((copiedPage) => pdfDocToSave.addPage(copiedPage));

    const pdfBytes = await pdfDocToSave.save();
    fs.writeFileSync("updated.pdf", pdfBytes);

    res.send("PDF cut and saved successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
