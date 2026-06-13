const orders = $input.all().map(item => item.json);

// Helpers
const normalize = (value) => String(value || '').trim().toLowerCase();

const getStatus = (order) => order.statuts || order.status || '';

const getQuantity = (order) => Number(order.quantity || order.Quantity || 0);

const getSupplier = (order) =>
  order.supplier ||
  order.Supplier ||
  order.supplier_name ||
  order.Supplier_Name ||
  'Unknown Supplier';

const getWarehouse = (order) =>
  order.warehouse ||
  order.Warehouse ||
  order.warehouse_name ||
  order.Warehouse_Name ||
  order.entrepot ||
  order.entrepôt ||
  order.depot ||
  order.Depot ||
  'Unknown Warehouse';

const getPriority = (order) => order.priority || order.Priority || '';

const getOrderId = (order) =>
  order.order_id ||
  order.Order_ID ||
  order.orderId ||
  order.id ||
  'Unknown Order';

const getClient = (order) =>
  order.client ||
  order.Client ||
  order.customer ||
  order.Customer ||
  'Unknown Client';

// Get planned delivery date from CSV
const getPlannedDate = (order) =>
  order.planned_delivery_date ||
  order.Planned_Delivery_Date ||
  order.plannedDeliveryDate ||
  order.planned_date ||
  order.Planned_Date ||
  order.delivery_date ||
  order.Delivery_Date ||
  order.date ||
  order.Date ||
  '';

// Detect report_date from the CSV
// Logic: take the most frequent planned_delivery_date in the file
const dateCounts = {};

for (const order of orders) {
  const rawDate = getPlannedDate(order);
  const cleanDate = String(rawDate || '').trim().slice(0, 10);

  if (cleanDate) {
    dateCounts[cleanDate] = (dateCounts[cleanDate] || 0) + 1;
  }
}

const reportDate =
  Object.entries(dateCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
  new Date().toISOString().slice(0, 10);

// Execution timestamp
const createdAt = new Date().toISOString();

// Delayed orders
const delayedOrders = orders.filter(order =>
  normalize(getStatus(order)) === 'delayed'
);

// High priority delayed orders
const highPriorityDelayed = delayedOrders.filter(order =>
  normalize(getPriority(order)) === 'high'
);

// Total delayed quantity
const totalDelayedQuantity = delayedOrders.reduce((sum, order) => {
  return sum + getQuantity(order);
}, 0);

// Delay rate
const delayRateNumber = orders.length > 0
  ? (delayedOrders.length / orders.length) * 100
  : 0;

// Clean delay rate number for Looker Studio
const delayRateNumberClean = Number(delayRateNumber.toFixed(1));

// Version Google Sheets FR if needed
// Use this only if Google Sheets reads 38.0 as text instead of number
const delayRateNumberSheets = String(delayRateNumberClean).replace('.', ',');

// Risk level
const riskLevel =
  highPriorityDelayed.length >= 20 || delayRateNumberClean >= 30
    ? 'High'
    : highPriorityDelayed.length >= 5 || delayRateNumberClean >= 15
      ? 'Medium'
      : 'Low';

// Group suppliers with useful business KPIs
const supplierMap = {};

for (const order of delayedOrders) {
  const supplier = getSupplier(order);

  if (!supplierMap[supplier]) {
    supplierMap[supplier] = {
      supplier,
      delayed_orders: 0,
      high_priority_delayed: 0,
      delayed_quantity: 0,
      orders: []
    };
  }

  supplierMap[supplier].delayed_orders += 1;
  supplierMap[supplier].delayed_quantity += getQuantity(order);

  if (normalize(getPriority(order)) === 'high') {
    supplierMap[supplier].high_priority_delayed += 1;
  }

  supplierMap[supplier].orders.push(getOrderId(order));
}

const topSuppliers = Object.values(supplierMap)
  .sort((a, b) =>
    b.high_priority_delayed - a.high_priority_delayed ||
    b.delayed_quantity - a.delayed_quantity ||
    b.delayed_orders - a.delayed_orders
  )
  .slice(0, 5);

// Group warehouses with useful business KPIs
const warehouseMap = {};

for (const order of delayedOrders) {
  const warehouse = getWarehouse(order);

  if (!warehouseMap[warehouse]) {
    warehouseMap[warehouse] = {
      warehouse,
      delayed_orders: 0,
      high_priority_delayed: 0,
      delayed_quantity: 0,
      orders: []
    };
  }

  warehouseMap[warehouse].delayed_orders += 1;
  warehouseMap[warehouse].delayed_quantity += getQuantity(order);

  if (normalize(getPriority(order)) === 'high') {
    warehouseMap[warehouse].high_priority_delayed += 1;
  }

  warehouseMap[warehouse].orders.push(getOrderId(order));
}

const topWarehouses = Object.values(warehouseMap)
  .sort((a, b) =>
    b.high_priority_delayed - a.high_priority_delayed ||
    b.delayed_quantity - a.delayed_quantity ||
    b.delayed_orders - a.delayed_orders
  )
  .slice(0, 5);

// Top urgent orders
const topUrgentOrders = highPriorityDelayed
  .sort((a, b) => getQuantity(b) - getQuantity(a))
  .slice(0, 10)
  .map(order => ({
    order_id: getOrderId(order),
    client: getClient(order),
    supplier: getSupplier(order),
    warehouse: getWarehouse(order),
    quantity: getQuantity(order),
    expected_delivery_date:
      order.expected_delivery_date ||
      order.Expected_Delivery_Date ||
      order.planned_delivery_date ||
      order.Planned_Delivery_Date ||
      '',
    action_status: order.action_status || order.Action_Status || ''
  }));

// Simple fields for Google Sheets / Looker Studio
const criticalSuppliers = topSuppliers
  .map(item => item.supplier)
  .join(', ');

const impactedWarehouses = topWarehouses
  .map(item => item.warehouse)
  .join(', ');

// Full report object
const report = {
  // Date fields
  report_date: reportDate,
  created_at: createdAt,

  // Main KPI
  total_orders: orders.length,
  delayed_orders: delayedOrders.length,
  high_priority_delayed: highPriorityDelayed.length,
  total_delayed_quantity: totalDelayedQuantity,

  // delay_rate for PDF / Telegram / Gmail
  delay_rate: `${delayRateNumberClean}%`,

  // delay_rate_number for Google Sheets / Looker Studio
  delay_rate_number: delayRateNumberClean,

  // Optional FR format if needed in Google Sheets
  delay_rate_number_sheets: delayRateNumberSheets,

  risk_level: riskLevel,

  // Simple fields for Google Sheets
  critical_suppliers: criticalSuppliers || 'N/A',
  impacted_warehouses: impactedWarehouses || 'N/A',
  report_statuts: 'Processed',

  // Detailed fields for AI Agent / PDF / Telegram
  top_suppliers_to_contact_first: topSuppliers,
  top_warehouses_to_update_first: topWarehouses,
  top_urgent_orders_to_prioritize: topUrgentOrders
};

return [
  {
    json: {
      ...report,
      report_json: JSON.stringify(report, null, 2)
    }
  }
];