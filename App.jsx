import { useEffect, useRef, useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import CalculatorDisplay from './components/CalculatorDisplay.jsx';
import CalculatorKeypad from './components/CalculatorKeypad.jsx';
import TransactionButtons from './components/TransactionButtons.jsx';
import Notification from './components/Notification.jsx';
import { useCalculator } from './hooks/useCalculator.js';
import { toMinorUnits } from './calculator/expressionEvaluator.js';
import { saveTransaction } from './services/transactionService.js';
import { exportTransactionsCsv } from './services/csvExportService.js';

export default function App() {
  const calculator = useCalculator();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);
  const noticeTimer = useRef(null);
  const operationLock = useRef(false);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.clearTimeout(noticeTimer.current);
    };
  }, []);

  function notify(type, message) {
    setNotice({ type, message });
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
  }

  function haptic() {
    try { navigator.vibrate?.(10); } catch { /* Optional enhancement only. */ }
  }

  function handleKey(key) {
    haptic();
    if (key === 'AC') calculator.clear();
    else if (key === '⌫') calculator.backspace();
    else if (key === '=') {
      if (calculator.result.value === null) notify('error', calculator.result.error || 'Complete the calculation first.');
      else calculator.calculate();
    } else calculator.append(key);
  }

  async function handleSave(type) {
    if (operationLock.current) return;
    haptic();
    if (!calculator.expression) { notify('error', 'Enter an amount first.'); return; }
    if (calculator.result.value === null) { notify('error', calculator.result.error || 'Check the calculation.'); return; }
    let minorUnits;
    try { minorUnits = toMinorUnits(calculator.result.value); }
    catch (error) { notify('error', error.message); return; }

    operationLock.current = true;
    setBusy(true);
    try {
      await saveTransaction(type, minorUnits);
      const amount = new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(minorUnits / 100);
      calculator.clear();
      notify('success', `${type === 'INCOME' ? 'Income' : 'Expense'} saved · LKR ${amount}`);
    } catch (error) {
      notify('error', error.message || 'Could not save. Your calculation is still here.');
    } finally {
      operationLock.current = false;
      setBusy(false);
    }
  }

  async function handleExport() {
    if (operationLock.current) return;
    haptic();
    operationLock.current = true;
    setBusy(true);
    try {
      const result = await exportTransactionsCsv();
      notify('success', result.count ? `Exported ${result.count} transaction${result.count === 1 ? '' : 's'}.` : 'CSV exported. No transactions have been saved yet.');
    } catch {
      notify('error', 'Export failed. Please try again.');
    } finally {
      operationLock.current = false;
      setBusy(false);
    }
  }

  return <main className="app-shell">
    <div className="calculator-card">
      <AppHeader onExport={handleExport} online={online} busy={busy}/>
      <div className="screen-label"><span>DAILY CASH ENTRY</span><span className="secure-label">● SAVED ON THIS DEVICE</span></div>
      <CalculatorDisplay expression={calculator.expression} result={calculator.result}/>
      <div className="keypad-label"><span>CALCULATOR</span><span>Tap to enter</span></div>
      <CalculatorKeypad onKey={handleKey} disabled={busy}/>
      <div className="action-divider"><span>RECORD TRANSACTION</span></div>
      <TransactionButtons onSave={handleSave} disabled={busy}/>
      <div className="footer-note"><span className="status-dot"></span> Your entries stay on this device. Export regularly to keep a backup.</div>
    </div>
    <Notification notice={notice}/>
    <div className="data-warning">Local device storage is not a permanent backup. Clearing browser data or uninstalling the app may erase saved transactions.</div>
  </main>;
}