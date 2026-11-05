import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateExpression, toMinorUnits } from '../src/calculator/expressionEvaluator.js';

test('respects operator precedence and parentheses', () => {
  assert.equal(evaluateExpression('2+3*4'), 14);
  assert.equal(evaluateExpression('(2+3)*4'), 20);
});

test('supports decimals, unary signs and division', () => {
  assert.equal(evaluateExpression('1.25+2.5'), 3.75);
  assert.equal(evaluateExpression('10/4'), 2.5);
  assert.equal(evaluateExpression('-(2+3)'), -5);
});

test('rejects incomplete, malformed and divide-by-zero expressions', () => {
  for (const expression of ['', '1+', '(2+3', '2..3', '1/0', '2+abc']) {
    assert.throws(() => evaluateExpression(expression));
  }
});

test('converts LKR to integer minor units and rejects non-positive values', () => {
  assert.equal(toMinorUnits(1750), 175000);
  assert.equal(toMinorUnits(12.34), 1234);
  assert.throws(() => toMinorUnits(0));
  assert.throws(() => toMinorUnits(-1));
});
