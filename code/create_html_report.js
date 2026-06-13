const report = $json.output || "No report available";

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SAP ERP Daily Orders Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #222;
      line-height: 1.6;
    }
    h1 {
      color: #1f4e79;
      border-bottom: 3px solid #1f4e79;
      padding-bottom: 10px;
    }
    .meta {
      font-size: 13px;
      color: #666;
      margin-bottom: 25px;
    }
    .box {
      background: #f5f7fa;
      border-left: 5px solid #1f4e79;
      padding: 15px;
      white-space: pre-wrap;
      font-size: 14px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <h1>SAP/ERP Daily Orders Report</h1>
  <div class="meta">
    Generated automatically by n8n AI Supply Chain Agent
  </div>

  <div class="box">${report}</div>

  <div class="footer">
    Automated report for delayed orders, suppliers, warehouses and priority actions.
  </div>
</body>
</html>
`;

return [
  {
    json: {
      reportText: report,
      fileName: "sap_erp_daily_orders_report.html"
    },
    binary: {
      data: {
        data: Buffer.from(html, "utf8").toString("base64"),
        mimeType: "text/html",
        fileName: "sap_erp_daily_orders_report.html"
      }
    }
  }
];