import { getAllTransactions } from '../database/transactionDatabase.js';

const pad = (n) => String(n).padStart(2, '0');
function timestampForCsv(value) {
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/);
  return match ? `${match[1]} ${match[2]}` : value;
}
function csvCell(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function exportTransactionsCsv() {
  const transactions = await getAllTransactions();
  const headers = ['TRANSACTION_ID', 'TRANSACTION_TYPE', 'TRANSACTION_TIMESTAMP', 'AMOUNT_LKR'];
  const rows = transactions.map((t) => [
    t.transaction_id,
    t.transaction_type,
    timestampForCsv(t.transaction_timestamp),
    (t.amount_minor_units / 100).toFixed(2)
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const date = new Date();
  const filename = `Cashbook_Transactions_${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.csv`;

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  try {
    anchor.click();
  } finally {
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return { count: transactions.length, filename };
}