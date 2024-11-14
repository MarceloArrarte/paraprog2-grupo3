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
          if (t.isNumericLiteral(left) && t.isNumericLiteral(right)) {
            replaceBinaryWithLiteralsWithLiteral({ t, path, operator, left, right })
          }
          // Verifica para operadores `&&` y `||` donde uno de los operandos es un literal
          if ((t.isNumericLiteral(left) || t.isNumericLiteral(right)) && (operator === '&&' || operator === '||')) {
            replaceBinaryWithLiteralsWithLiteral({ t, path, operator, left, right });
          }
        }
      }
    }
  }
}

function replaceBinaryWithLiteralsWithLiteral({ t, path, operator, left, right }) {
  switch (operator) {
    case '+':
      path.replaceWith(t.numericLiteral(left.value + right.value));
      break;
    case '-':
      path.replaceWith(t.numericLiteral(left.value - right.value));
      break;
    case '*':
      path.replaceWith(t.numericLiteral(left.value * right.value));
      break;
    case '/':
      path.replaceWith(t.numericLiteral(left.value / right.value));
      break;
    case '%':
      path.replaceWith(t.numericLiteral(left.value % right.value));
      break;
    case '**':
      path.replaceWith(t.numericLiteral(left.value ** right.value));
      break;
    case '&&':
      path.replaceWith(t.numericLiteral(left.value && right.value ? right.value : 0));
      break;
    case '||':
      path.replaceWith(left.value !== 0 ? t.numericLiteral(left.value): right.value);
      break;
    case '==':
      path.replaceWith(t.booleanLiteral(left.value == right.value));
      break;
    case '===':
      path.replaceWith(t.booleanLiteral(left.value === right.value));
      break;
    case '!=':
      path.replaceWith(t.booleanLiteral(left.value != right.value));
      break;
    case '!==':
      path.replaceWith(t.booleanLiteral(left.value !== right.value));
      break;
    case '>':
      path.replaceWith(t.booleanLiteral(left.value > right.value));
      break;
    case '<':
      path.replaceWith(t.booleanLiteral(left.value < right.value));
      break;
    case '>=':
      path.replaceWith(t.booleanLiteral(left.value >= right.value));
      break;
    case '<=':
      path.replaceWith(t.booleanLiteral(left.value <= right.value));
      break;
    default:
      throw new Error('Que haces capo lpm')
  }
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
  x = 0 && 1;
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

  // const codeIn = test1;
  // const {
  //   ast, code: codeOut,
  // } = transformSync(codeIn, {
  //   plugins: [pluginSwitchComma], 
  // });
  // console.log(`${codeIn}\n\n  >>>>  \n\n${codeOut}`);
} // main

main();