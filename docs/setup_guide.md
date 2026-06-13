# Setup Guide

## 1. Import Workflow

Import:

```text
workflow/sap_erp_daily_orders_agent_sanitized.json
```

into your n8n instance.

## 2. Configure Credentials

Reconnect these credentials inside n8n:

- Gmail OAuth2
- Telegram Bot API
- Groq API
- Google Sheets OAuth2
- ConvertAPI token

## 3. Prepare Google Sheets

Create a Google Sheet named:

```text
SAP ERP Daily Orders KPI Dashboard
```

Create a tab named:

```text
KPI_Log
```

Recommended columns:

```text
report_date
total_orders
delayed_orders
delay_rate
delay_rate_number
high_priority_delayed
total_delayed_quantity
critical_suppliers
impacted_warehouses
risk_level
report_statuts
created_at
```

## 4. Configure Gmail Trigger

The workflow searches for emails matching:

```text
subject:"SAP Daily Orders Export" has:attachment filename:csv
```

Send yourself a test email with a CSV attachment using the sample data.

## 5. Configure Telegram

Replace:

```text
YOUR_TELEGRAM_CHAT_ID
```

with your real Telegram chat ID inside n8n.

## 6. Configure ConvertAPI

Replace:

```text
Bearer YOUR_CONVERTAPI_TOKEN
```

with your real ConvertAPI token inside n8n.

## 7. Configure Dashboard Link

Replace:

```text
YOUR_LOOKER_STUDIO_DASHBOARD_URL
```

with your Looker Studio dashboard URL.

## 8. Test End-to-End

Expected outputs:

- Telegram alert
- Google Sheets KPI row
- Gmail PDF report
- Dashboard update
