function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "error: LOL nice try!";
  }
  return a / b;
}

function roundResult(num) {
  return Math.round(num * 100000) / 100000;
}

function operate(operator, a, b) {
  switch (operator) {
    case '+': return add(a, b);
    case '-': return subtract(a, b);
    case '*': return multiply(a, b);
    case '/': return b === 0 ? "error: LOL nice try!" : roundResult(divide(a, b));
    default: return "Invalid operator";
  }
}

const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('.btn.number');
const operatorButtons = document.querySelectorAll('.btn.operator');
const equalButton = document.querySelector('.btn.equal');
const clearButton = document.querySelector('[data-op="clear"]');
const decimalButton = document.querySelector('[data-decimal="."]');
const backspaceButton = document.getElementById('backspace');

let firstOperand = '';
let secondOperand = '';
let currentOperator = null;
let currentInput = '';
let shouldResetDisplay = false;

function updateDecimalButton() {
  decimalButton.disabled = currentInput.includes('.');
}

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (shouldResetDisplay) {
      currentInput = '';
      shouldResetDisplay = false;
    }
    currentInput += button.textContent;
    display.textContent = currentInput;
    updateDecimalButton();
  });
});

operatorButtons.forEach(button => {
  const operator = button.dataset.op;
  if (operator === 'clear') return;
  button.addEventListener('click', () => {
    if (currentInput === '') return;
    if (firstOperand && currentOperator && !shouldResetDisplay) {
      secondOperand = currentInput;
      const result = operate(currentOperator, parseFloat(firstOperand), parseFloat(secondOperand));
      display.textContent = result;
      firstOperand = typeof result === 'number' ? result : '';
    } else {
      firstOperand = currentInput;
    }
    currentOperator = operator;
    currentInput = '';
    shouldResetDisplay = true;
    updateDecimalButton();
  });
});

equalButton.addEventListener('click', () => {
  if (!currentOperator || currentInput === '' || firstOperand === '') return;
  secondOperand = currentInput;
  const result = operate(currentOperator, parseFloat(firstOperand), parseFloat(secondOperand));
  display.textContent = result;
  firstOperand = typeof result === 'number' ? result : '';
  currentInput = '';
  currentOperator = null;
  shouldResetDisplay = true;
  updateDecimalButton();
});

clearButton.addEventListener('click', () => {
  firstOperand = '';
  secondOperand = '';
  currentOperator = null;
  currentInput = '';
  shouldResetDisplay = false;
  display.textContent = '0';
  updateDecimalButton();
});

decimalButton.addEventListener('click', () => {
  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
  }
  if (currentInput.includes('.')) return;
  currentInput += '.';
  display.textContent = currentInput;
  updateDecimalButton();
});

backspaceButton.addEventListener('click', () => {
  if (shouldResetDisplay || currentInput === '') return;
  currentInput = currentInput.slice(0, -1);
  display.textContent = currentInput || '0';
  updateDecimalButton();
});

window.addEventListener('keydown', handleKeyboardInput);

function handleKeyboardInput(e) {
  const key = e.key;
  if (/\d/.test(key)) simulateButtonClick(key);
  if (key === '.' && !currentInput.includes('.')) simulateButtonClick(key);
  if (key === 'Backspace') backspaceButton.click();
  if (['+', '-', '*', '/'].includes(key)) simulateButtonClick(key);
  if (key === '=' || key === 'Enter') equalButton.click();
  if (key === 'Escape') clearButton.click();
}

function simulateButtonClick(value) {
  if (value === '.' && currentInput.includes('.')) return;
  const button = [...document.querySelectorAll('button')].find(btn =>
    btn.textContent === value || btn.dataset.op === value
  );
  if (button) button.click();
}
