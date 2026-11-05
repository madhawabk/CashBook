export default function CalculatorDisplay({ expression, result }) {
  const formatted = result.value === null ? '—' : new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(result.value);
  return <section className="display-panel" aria-label="Calculator display">
    <div className="expression" aria-live="polite">{expression || <span className="placeholder">Enter amount</span>}</div>
    <div className="result-row">
      <span className="currency-label">LKR</span>
      <output className="result-value">{formatted}</output>
    </div>
    {result.error && expression && <div className="inline-hint">{result.error}</div>}
  </section>;
}