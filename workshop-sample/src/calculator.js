const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b === 0 ? 'NaN' : a / b);

const operators = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
};

module.exports.operation = (firstOperand, secondOperand, operator) => {
  const result = operators[operator](Number(firstOperand), Number(secondOperand));
  return result;
};

module.exports.operators = operators;
