import { Delete } from 'lucide-react';

const keys = [
  ['7', '8', '9', '÷'], ['4', '5', '6', '×'], ['1', '2', '3', '−'],
  ['(', '0', ')', '+'], ['AC', '.', '⌫', '=']
];
export default function CalculatorKeypad({ onKey, disabled }) {
  return <div className="keypad" aria-label="Calculator keypad">
    {keys.flat().map((key) => <button
      key={key}
      disabled={disabled}
      className={`key ${['÷', '×', '−', '+'].includes(key) ? 'operator' : ''} ${key === '=' ? 'equals' : ''} ${key === 'AC' ? 'utility' : ''} ${key === '⌫' ? 'utility' : ''}`}
      onClick={() => onKey(key)}
      aria-label={key === '⌫' ? 'Backspace' : key === 'AC' ? 'Clear all' : key}
    >{key === '⌫' ? <Delete size={22} strokeWidth={2.2}/> : key}</button>)}
  </div>;
}