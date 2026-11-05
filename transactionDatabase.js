const DB_NAME = 'CashbookCalculatorDB';
const DB_VERSION = 1;
const STORE = 'transactions';

let databasePromise;

export function openDatabase() {
  if (!('indexedDB' in window)) return Promise.reject(new Error('Local storage is not available in this browser.'));
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'transaction_id', autoIncrement: true });
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); databasePromise = undefined; };
        resolve(db);
      };
      request.onerror = () => { databasePromise = undefined; reject(new Error('Could not open local transaction storage.')); };
      request.onblocked = () => reject(new Error('Close other Cashbook tabs and try again.'));
    });
  }
  return databasePromise;
}

export async function addTransaction(transaction) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const request = tx.objectStore(STORE).add(transaction);
    let id;
    request.onsuccess = () => { id = request.result; };
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(new Error('Transaction could not be saved. Please try again.'));
    tx.onabort = () => reject(new Error('Transaction could not be saved. Please try again.'));
  });
}

export async function getAllTransactions() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result.sort((a, b) => a.transaction_id - b.transaction_id));
    request.onerror = () => reject(new Error('Could not read saved transactions.'));
  });
}