// Small recursive-descent parser. No eval(), Function(), or third-party parser.
const MAX_LENGTH = 120;

export function evaluateExpression(input) {
  const source = String(input ?? '').replace(/[×]/g, '*').replace(/[÷]/g, '/').replace(/[−]/g, '-').replace(/\s+/g, '');
  if (!source || source.length > MAX_LENGTH) throw new Error('Enter a valid calculation.');
  let index = 0;

  function parseExpression() {
    let value = parseTerm();
    while (source[index] === '+' || source[index] === '-') {
      const op = source[index++];
      const right = parseTerm();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }

  function parseTerm() {
    let value = parseUnary();
    while (source[index] === '*' || source[index] === '/') {
      const op = source[index++];
      const right = parseUnary();
      if (op === '/' && right === 0) throw new Error('Cannot divide by zero.');
      value = op === '*' ? value * right : value / right;
    }
    return value;
  }

  function parseUnary() {
    if (source[index] === '+') { index++; return parseUnary(); }
    if (source[index] === '-') { index++; return -parseUnary(); }
    return parsePrimary();
  }

  function parsePrimary() {
    if (source[index] === '(') {
      index++;
      const value = parseExpression();
      if (source[index] !== ')') throw new Error('Check your brackets.');
      index++;
      return value;
    }
    const start = index;
    let dots = 0;
    while (index < source.length && /[0-9.]/.test(source[index])) {
      if (source[index] === '.') dots++;
      if (dots > 1) throw new Error('Check the decimal point.');
      index++;
    }
    if (start === index || source.slice(start, index) === '.') throw new Error('Complete the calculation first.');
    return Number(source.slice(start, index));
  }

  const result = parseExpression();
  if (index !== source.length || !Number.isFinite(result)) throw new Error('Check the calculation.');
  return result;
}

export function isCompleteExpression(expression) {
  try { evaluateExpression(expression); return true; } catch { return false; }
}

export function toMinorUnits(amount) {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount must be greater than zero.');
  const rounded = Math.round((amount + Number.EPSILON) * 100);
  if (!Number.isSafeInteger(rounded) || rounded <= 0 || rounded > 999999999999) {
    throw new Error('This amount is too large to save.');
  }
  return rounded;
}