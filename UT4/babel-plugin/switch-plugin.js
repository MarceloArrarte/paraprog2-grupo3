import { transformSync } from '@babel/core';

// Check <https://babeljs.io/docs/babel-types>.
function pluginSwitchComma({ types: t }) {
  return {
    visitor: {
      SwitchStatement(path) {
        path.node.cases = [...(function* () {
          for (const c of path.node.cases) {
            print('b')
            if (c.test?.type !== 'SequenceExpression') {
              yield c;
            } else {
              for (const caseTest of c.test.expressions.slice(0, -1)) {
                yield t.switchCase(caseTest, []);
              }
              yield t.switchCase(c.test.expressions.at(-1), c.consequent);
            }
          }
        })()];
      }
    } // visitor
  };
}; // function pluginSwitchComma


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
    }
  }
}
function replaceUnaryWithLiteralsWithLiteral({ t, path, operator, argument }){
  if(!(t.isBooleanLiteral(argument) || t.isNumericLiteral(argument))){
    return
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

const test1 = `
function f(x) {
  switch (x) {
    case 0: return 1;
    case 1, 2, 3: return x;
    default: return NaN;
  }
}
`;

const test2 = `
function f(x) {
  x = -1 >>> 6;
}
`;

function main() {
  const codeIn = test2;

  const {
    ast, code: codeOut,
  } = transformSync(codeIn, {
    plugins: [pluginAlgebraiquicSimplification], 
  });
  console.log(`${codeIn}\n\n  >>>>  \n\n${codeOut}`);
} // main

main();