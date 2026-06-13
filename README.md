# SAP/ERP Daily Orders Report Agent

## Project Overview

This project is an end-to-end **AI automation workflow for supply chain reporting**, built with **n8n**.

It automatically processes daily SAP/ERP order CSV files, calculates operational KPIs, sends a Telegram alert, logs KPI history in Google Sheets, generates a PDF report, sends it by Gmail, and supports a Looker Studio dashboard.

## Business Problem

Supply chain teams often spend time every day opening ERP exports, checking delayed orders, calculating KPIs, preparing reports, and notifying managers.

This workflow reduces manual reporting work and gives managers a clear daily view of operational risk.

## Workflow Architecture

```text
Gmail Trigger
→ Extract from File
→ Code JavaScript KPI
→ Google Sheets Append Row
→ AI Agent
→ Telegram Alert
→ Create HTML Report
→ Convert HTML to PDF
→ Extract PDF File
→ Gmail Send Report
→ Looker Studio Dashboard
```

## Main Features

- Reads daily SAP/ERP order CSV files from Gmail
- Extracts CSV attachments automatically
- Calculates supply chain KPIs with JavaScript
- Detects delayed orders
- Identifies high-priority delayed orders
- Calculates delay rate
- Identifies critical suppliers
- Identifies impacted warehouses
- Sends concise bilingual Telegram alerts
- Generates a PDF management report
- Sends the PDF report by Gmail
- Logs KPI history in Google Sheets
- Supports dashboard monitoring in Looker Studio

## Key KPIs

| KPI | Description |
|---|---|
| Total Orders | Number of daily orders processed |
| Delayed Orders | Number of orders with delayed status |
| Delay Rate | Percentage of delayed orders |
| High-Priority Delayed Orders | Critical delayed orders requiring priority action |
| Total Delayed Quantity | Total quantity impacted by delayed orders |
| Critical Suppliers | Suppliers linked to the most important delays |
| Impacted Warehouses | Warehouses affected by delayed orders |
| Risk Level | Operational risk level based on delay rate and priority orders |

## Repository Structure

```text
sap-erp-daily-orders-report-agent/
├── README.md
├── workflow/
│   └── sap_erp_daily_orders_agent_sanitized.json
├── sample-data/
│   └── sample_orders_1000_anonymized.csv
├── screenshots/
│   └── add-your-screenshots-here.md
├── docs/
│   ├── project_architecture.md
│   ├── setup_guide.md
│   └── security_notes.md
├── code/
│   ├── javascript_kpi.js
│   ├── create_html_report.js
│   └── extract_pdf_file.js
└── prompts/
    └── ai_agent_prompt.md
```

## Tools Used

| Tool | Role |
|---|---|
| n8n | Workflow automation |
| Gmail Trigger | Receives daily SAP/ERP CSV file |
| JavaScript Code Node | Cleans data and calculates KPIs |
| AI Agent | Generates concise business recommendations |
| Groq / LLaMA | AI model used by the agent |
| Google Sheets | Stores KPI history |
| Looker Studio | Visualizes operational KPIs |
| Telegram | Sends instant alerts |
| Gmail | Sends PDF report |
| ConvertAPI | Converts HTML report to PDF |

## Sample Data

An anonymized sample CSV is included:

```text
sample-data/sample_orders_1000_anonymized.csv
```

The data contains synthetic clients, suppliers, warehouses, quantities, priorities, delivery dates, and order statuses.

## Security Notes

This public repository does not include:

- Real customer data
- Real supplier data
- Gmail credentials
- Telegram bot tokens
- Telegram chat ID
- ConvertAPI token
- Groq API key
- Google Sheets private IDs
- ngrok token or URLs
- Local `.n8n` folder

Before using the workflow, add your own credentials directly inside n8n.

## How to Use

1. Import the sanitized workflow into n8n.
2. Reconnect your own Gmail, Telegram, Google Sheets, Groq, and ConvertAPI credentials.
3. Create a Google Sheet with a `KPI_Log` tab.
4. Map the KPI fields in the Google Sheets node.
5. Replace the Looker Studio dashboard URL in the Gmail node.
6. Send a test email with a CSV attachment.
7. Run the workflow and validate Telegram, Gmail, Google Sheets, and dashboard outputs.

## Project Status

Validated end-to-end with a 1000-order CSV test file.

Working components:

- Gmail Trigger
- CSV extraction
- JavaScript KPI calculation
- Google Sheets logging
- AI-generated operational alert
- Telegram notification
- HTML report creation
- PDF generation
- Gmail report sending
- Looker Studio dashboard monitoring

## Portfolio Summary

Built an end-to-end SAP/ERP daily orders reporting agent using n8n, JavaScript, AI Agent, Gmail, Telegram, Google Sheets, and Looker Studio. The workflow automatically processes daily order CSV files, calculates supply chain KPIs, detects delayed orders and critical suppliers, generates a PDF report, updates a dashboard, and sends business alerts to managers.

## Author

Achraf Sifaddine  
Data Analytics | AI Automation | Supply Chain Reporting
