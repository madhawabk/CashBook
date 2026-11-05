import { useMemo, useState } from 'react';
import { evaluateExpression } from '../calculator/expressionEvaluator.js';

export function useCalculator() {
  const [expression, setExpression] = useState('');
  const result = useMemo(() => {
    if (!expression) return { value: null, error: null };
    try { return { value: evaluateExpression(expression), error: null }; }
    catch (error) { return { value: null, error: error.message }; }
  }, [expression]);

  function append(value) {
    setExpression((current) => {
      if (value === '.') {
        const segment = current.split(/[+\-×÷*/()]/).at(-1) ?? '';
        if (segment.includes('.')) return current;
      }
      if (['+', '−', '×', '÷'].includes(value)) {
        if (!current && value !== '−') return current;
        if (/[+\-×÷]$/.test(current) && value !== '−') return current.slice(0, -1) + value;
      }
      if (value === '(' && /[\d)]$/.test(current)) return current + '×(';
      if (/^\d$/.test(value) && current.endsWith(')')) return current + '×' + value;
      return current + value;
    });
  }
  function backspace() { setExpression((current) => current.slice(0, -1)); }
  function clear() { setExpression(''); }
  function calculate() {
    if (result.value === null) return;
    setExpression(String(Number(result.value.toFixed(8))));
  }
  return { expression, result, append, backspace, clear, calculate, setExpression };
}