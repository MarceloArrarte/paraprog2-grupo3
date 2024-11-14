import { transformSync } from '@babel/core';

function pluginAlgebraiquicSimplification({ types: t }){
  return {
    visitor: {
      BinaryExpression: {
        exit(path) {
          const { operator, left, right } = path.node;
          replaceBinaryWithLiteralsWithLiteral({ t, path, operator, left, right });
          
        }
      },
      UnaryExpression: {
        exit(path) {
          const { operator, argument } = path.node;
          replaceUnaryWithLiteralsWithLiteral({ t, path, operator,argument });
        }
      },
      ConditionalExpression: {
        exit(path) {
          const { test, consequent, alternate } = path.node;
          optimizeTernaryExpression({ t, path, test, consequent, alternate });
        }
      },
      IfStatement: {
        exit(path) {
          const { test, consequent, alternate } = path.node;
          optimizeIfStatement({ t, path, test, consequent, alternate });
        }
      },
      WhileStatement: {
        exit(path) {
          const { test, body } = path.node;
          optimizeWhileStatement({ t, path, test, body });
        }
      }
    }
  }
}

function replaceUnaryWithLiteralsWithLiteral({ t, path, operator, argument }){
  if(!(t.isBooleanLiteral(argument) || t.isNumericLiteral(argument))){
    return;
  }

  const unary_operator = {
    '!' : (a, t) => t.booleanLiteral(!a),
    '+' : (a, t) => t.numericLiteral(+a),
    '-' : (a, t) => t.numericLiteral(-a),
    '~' : (a, t) => t.numericLiteral(~a),
  }
  if (operator in unary_operator) {
    const result = unary_operator[operator](argument.value, t);
    path.replaceWith(result);
    return;
  } 
  throw new Error(`Unario no valido`);
  
}


function replaceBinaryWithLiteralsWithLiteral({ t, path, operator, left, right }) {
  const numericOperators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => a % b,
    '**': (a, b) => a ** b,
    '|': (a, b) => a | b,
    '&': (a, b) => a & b,
    '^': (a, b) => a ^ b,
    '<<': (a, b) => a << b,
    '>>': (a, b) => a >> b,
    '>>>': (a, b) => a >>> b,
  };

  const booleanOperators = {
    '&&': (a, b) => a && b,
    '||': (a, b) => a || b,
    '??': (a, b) => a ?? b,
    '==': (a, b) => a == b,
    '===': (a, b) => a === b,
    '!=': (a, b) => a != b,
    '!==': (a, b) => a !== b,
    '>': (a, b) => a > b,
    '<': (a, b) => a < b,
    '>=': (a, b) => a >= b,
    '<=': (a, b) => a <= b,
  };

  let result;
  if (operator in numericOperators) {
    result = numericOperators[operator](left.value, right.value);
    path.replaceWith(t.numericLiteral(result));
    return;
  } 
  if(operator in booleanOperators) {
    result = booleanOperators[operator](left.value, right.value);
    path.replaceWith(t.booleanLiteral(result));
    return;
  }
  throw new Error(`Operador no soportado: ${operator}`);
}

function optimizeTernaryExpression({ t, path, test, consequent, alternate }) {
  if (!t.isBooleanLiteral(test)) {
    return;
  }
  if (test.value === true) {
    path.replaceWith(consequent);
    return;
  }
  path.replaceWith(alternate);
    
}

function optimizeIfStatement({ t, path, test, consequent, alternate }) {
  if (t.isBooleanLiteral(test)) {
    if (test.value === true) {
      path.replaceWith(consequent);
    } else if (alternate) {
      path.replaceWith(alternate);
    } else {
      path.remove();
    }
  } else if (t.isNumericLiteral(test)) {
    if (test.value === 0 || Number.isNaN(test.value)) {
      if (alternate) {
        path.replaceWith(alternate);
      } else {
        path.remove();
      }
    } else {
      path.replaceWith(consequent);
    }
  }
}

function optimizeWhileStatement({ t, path, test, body }) {
  if (t.isBooleanLiteral(test) && test.value === false) {
    path.remove();
  }
}


const testFalsaParte1 = `
function f(x) {
  x = -64 >> 2
  resultadoEsperadoArriba = -16

  y = 64 >>> 2
  resultadoEsperadoArriba = 16

  z = 3 << 3
  resultadoEsperadoArriba = 24

  gusanoLoco = -64 >> 2 >>> 2 << 3
  resultadoEsperadoArriba = -32
}
`;

const testFalsaParte2 = `
function f(x) {
  y = true ? 6 : 1;
  resultadoEsperadoArriba = 6

  x = (false ? 6 : 1) - 1;
  resultadoEsperadoArriba = 0

  guambia = (( 3 === 3 ? 3 * 2 : 33333333 / 2) + ( 3 == 1 ? 333333 : 2)) - 1;
  resultadoEsperadoArriba = 7

  valienteComoLaPrincesa = (( 3 != 2 ? 3 * 2 : 33333333 / 2) + ( 3 !== 3 ? 333333 : 2)) - 1;
  resultadoEsperadoArriba = 7

}
`;
const testVerdaderaParte1 = `
function f(x) {
  if (true) { x = 1; } else { x = 2; }
  resultadoEsperadoArriba = 1

  if (0) { y = 1; } else { y = 2; }
  resultadoEsperadoArriba = 2

  if (1) { z = 3; }
  resultadoEsperadoArriba = 3
}
`;

const testVerdaderaParte2 = `
function f(x) {
  while (1 != 2) { a = 4; }
  resultadoEsperadoArriba =  "ver true en el while y lo de adentro igual"
}
`;

function main() {
  const tests = [testFalsaParte1, testFalsaParte2, testVerdaderaParte1, testVerdaderaParte2];
  const pluginOptions = {
    plugins: [pluginAlgebraiquicSimplification],
  };

  tests.forEach((codeIn, index) => {
    const { code: codeOut } = transformSync(codeIn, pluginOptions);
    console.log(`Test ${index + 1}:\n`);
    console.log(`Código de entrada:\n${codeIn}\n`);
    console.log(">>>>\n");
    console.log(`Código transformado:\n${codeOut}\n`);
  });
}


main();