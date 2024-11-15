import readline from 'node:readline';
import { parse } from '@babel/core';
import { resourceUsage } from 'node:process';


function evalType(exp, symbols = new Map()) {
  if (typeof exp === 'string') {
    exp = parseExpression(`(${exp})`);
  }
  return evaluateNodeType(exp, symbols);
}

function parseExpression(expression) {
  try {
    const ast = parse(expression, { sourceType: 'module' });
    return ast?.program?.body?.[0]?.expression || null;
  } catch (error) {
    throw new SyntaxError(`Invalid expression: ${expression}`);
  }
}

function evaluateNodeType(exp, symbols) {
  if (!exp || !exp.type) {
    throw new SyntaxError('Invalid expression node');
  }

  switch (exp.type) {
    case 'NumericLiteral':
      return 'number';

    case 'BooleanLiteral':
      return 'boolean';

    case 'StringLiteral':
      return 'string';

    case 'Identifier':
      return getIdentifierType(exp.name, symbols);

    case 'BinaryExpression':
      return evaluateBinaryExpression(exp, symbols);

    case 'LogicalExpression':
      return evaluateLogicalExpression(exp, symbols);
    
    default:
      throw new SyntaxError(`Node type ${exp.type} is not supported`);
  }
}

function getIdentifierType(name, symbols) {
  if (!symbols.has(name)) {
    throw new ReferenceError(`Unknown identifier: ${name}`);
  }
  return symbols.get(name);
}

function evaluateUnaryExpression(exp) {
  switch (exp.operator) {
    case '!': {
      return 'boolean';
    }
    case '-':
    case '+': {
      return 'number';
    }
  }
}

function evaluateBinaryExpression(exp, symbols) {
  const leftType = evalType(exp.left, symbols);
  const rightType = evalType(exp.right, symbols);

  switch (exp.operator) {

    case '+': {
      if (leftType === 'string' || rightType === "string") {
        return 'string';
      }
      return 'number';
    }
    case '-': {
      return 'number';
    }
    case '*': {
      return 'number';
    }
    case '%': {
      return 'number';
    }
    case '/': {
      return 'number';
    }
    case '==':
    case '===':
    case '!=': 
    case '>':
    case '<':
    case '>=':
    case '<=': {
      return 'boolean';
    }
    case '&&':
    case '||': {
      if(leftType === rightType) {
        return leftType;
      }
      throw new SyntaxError(`Cannot determine type of ${leftType} ${exp.operator} ${rightType}`);
    }
    default:
      throw new SyntaxError(`Operator ${exp.operator} is not supported`);
  }
}

function evaluateLogicalExpression(exp, symbols) {
  
  const leftType = evalType(exp.left, symbols);
  const rightType = evalType(exp.right, symbols);
  
  switch (exp.operator) {
    case '==':
    case '===':
    case '!=': 
    case '>':
    case '<':
    case '>=':
    case '<=': {
      return 'boolean';
    }
    case '&&':
    case '||': {
      if(leftType === rightType) {
        return leftType;
      }
      throw new SyntaxError(`Cannot determine type of ${leftType} ${exp.operator} ${rightType}`);
    }
    default:
      throw new SyntaxError(`Operator ${exp.operator} is not supported`);
  }
}

async function main() {

  const symbols = new Map();
  symbols.set('x', 'number');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  rl.on('line', (line) => {
    if (line.trim().length > 0) {
      console.log(`typeof ${line} >>>> ${evalType(line, symbols)}`);
    } else {
      process.exit();
    }
  });
} // main

main();