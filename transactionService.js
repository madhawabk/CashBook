import { addTransaction } from '../database/transactionDatabase.js';

export async function saveTransaction(type, amountMinorUnits) {
  if (!['INCOME', 'EXPENSE'].includes(type)) throw new Error('Invalid transaction type.');
  if (!Number.isSafeInteger(amountMinorUnits) || amountMinorUnits <= 0) throw new Error('Enter an amount greater than zero.');
  const now = new Date();
  const transaction = {
    transaction_type: type,
    transaction_timestamp: localDateTimeISO(now),
    amount_minor_units: amountMinorUnits
  };
  const transaction_id = await addTransaction(transaction);
  return { ...transaction, transaction_id };
}

function localDateTimeISO(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}