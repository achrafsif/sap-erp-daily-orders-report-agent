const buffer = await this.helpers.getBinaryDataBuffer(0, 'data');
const rawText = buffer.toString('utf8').trim();

if (!rawText.startsWith('{')) {
  throw new Error("Expected ConvertAPI JSON, but received something else: " + rawText.slice(0, 50));
}

const parsed = JSON.parse(rawText);

if (!parsed.Files || !parsed.Files[0]) {
  throw new Error("ConvertAPI JSON received, but Files[0] is missing.");
}

const file = parsed.Files[0];

if (!file.FileData) {
  throw new Error(
    "Files[0].FileData is missing. Available keys: " + Object.keys(file).join(", ")
  );
}

// Clean possible base64 prefix
let pdfBase64 = file.FileData;

if (pdfBase64.includes(',')) {
  pdfBase64 = pdfBase64.split(',').pop();
}

pdfBase64 = pdfBase64.replace(/\s/g, '');

// Decode FileData to verify real PDF content
const pdfBuffer = Buffer.from(pdfBase64, 'base64');
const pdfStart = pdfBuffer.toString('utf8', 0, 10);

if (!pdfStart.startsWith('%PDF')) {
  throw new Error(
    "FileData exists, but it is not a valid PDF. Decoded start: " + pdfStart
  );
}

return [
  {
    json: {
      status: "Valid PDF extracted from ConvertAPI JSON",
      fileName: "sap_erp_daily_orders_report.pdf",
      decodedStart: pdfStart,
      convertApiFileName: file.FileName || "",
      fileSize: pdfBuffer.length
    },
    binary: {
      data: {
        data: pdfBuffer.toString('base64'),
        mimeType: "application/pdf",
        fileName: "sap_erp_daily_orders_report.pdf",
        fileExtension: "pdf"
      }
    }
  }
];