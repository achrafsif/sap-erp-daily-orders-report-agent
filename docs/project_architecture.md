# Project Architecture

## Workflow Logic

```text
Trigger → Extraction → KPI Calculation → AI Analysis → Storage → Notification → Business Output
```

## Detailed Flow

1. **Gmail Trigger**
   - Detects emails with the subject `SAP Daily Orders Export`
   - Downloads the CSV attachment

2. **Extract from File**
   - Reads the CSV attachment from Gmail
   - Converts rows into structured JSON items

3. **Code JavaScript KPI**
   - Cleans fields
   - Calculates total orders
   - Detects delayed orders
   - Calculates delay rate
   - Groups critical suppliers
   - Groups impacted warehouses
   - Builds a structured KPI JSON for the AI Agent

4. **Google Sheets Append Row**
   - Stores historical KPI data in the `KPI_Log` sheet
   - Feeds the Looker Studio dashboard

5. **AI Agent**
   - Reads the KPI JSON
   - Generates a concise bilingual operational alert
   - Gives priority actions based only on the provided data

6. **Telegram**
   - Sends the alert to the operations manager or team

7. **Create HTML Report**
   - Converts the AI summary into a clean HTML report

8. **Convert HTML to PDF**
   - Sends the HTML file to ConvertAPI
   - Receives PDF output data

9. **Extract PDF File**
   - Validates that the decoded file starts with `%PDF`
   - Creates a clean PDF binary file for Gmail

10. **Gmail Send Report**
   - Sends the PDF report by email
   - Includes the Looker Studio dashboard link
