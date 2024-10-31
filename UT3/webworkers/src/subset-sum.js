import { workerFunction } from "./utils";

export function randomSubsetSumProblem(args) {
  const {
    length = 50,
    maxValue = 2000,
  } = args ?? {};
  const randNum = () => Math.floor(Math.random() * (maxValue + 1));
  const ns = [...new Set(Array.from({ length }, randNum))];
  const target = randNum();
  /* Math.random() < prob
    ? ns.reduce((s, n) => s + (Math.random() < prob ? n : 0))
    : randNum();*/
  return [ns, target];
} // function randomSubsetSumProblem


export function _naiveSubsetSum(list, target) {

  const copy = [...list];
  while (copy.length > 0) {
    const n = copy.pop();
    if (n == target) {
      return [n];
    }
    else {
      if (n < target) {
        const maybeSolution = _naiveSubsetSum(copy, target - n);
        if (maybeSolution) {
          return [n, ...maybeSolution];
        }
      }
    }
  }

  return null;
}

export async function parallelNaiveSubsetSum(list, target) {
  const runSubsetSumWorker = workerFunction(_naiveSubsetSum);
  
  const copy = [...list];

  const promises = [];

  while (copy.length > 0) {
    const n = copy.pop();
    if (n == target) {
      promises.push(Promise.resolve([n]));
    }
    else {
      promises.push(
        runSubsetSumWorker(copy, target - n)
          .then(maybeSolution => {
            if (maybeSolution) {
              return [n, ...maybeSolution];
            }
            else {
              return Promise.reject('Sin solución en esta rama.');
            }
          })
      );
    }
  }

  try {
    const result = await Promise.any(promises);
    return result;
  }
  catch (err) {
    console.log('Todas las promesas rechazadas, no hay solución.');
    console.log(err);
    return null;
  }
}


export function* sequentialNaiveSubsetSum(ns, target) {
  const xs = [...ns];
  while (xs.length > 0) {
    const x = xs.pop();
    if (x === target) {
      yield [x];
    }
    for (const result of sequentialNaiveSubsetSum(xs, target - x)) {
      yield [x, ...result];
    }
  }
} // function naiveSubsetSum

export async function testSubsetSum() {
  // const [ns, target] = randomSubsetSumProblem();
  const {ns, target} = problem;

  const startTime = Date.now();
  // const firstSolution = sequentialNaiveSubsetSum(ns, target).next().value ?? null;
  const firstSolution = await parallelNaiveSubsetSum(ns, target);

  const time = (Date.now() - startTime) / 1e3;
  return { ns, target, firstSolution, time };
} // function testSubsetSum

let problem = {
  "ns": [
      1174,
      1504,
      1289,
      679,
      486,
      1669,
      462,
      167,
      1930,
      896,
      1163,
      1243,
      1839,
      1076,
      524,
      1534,
      1357,
      1366,
      1404,
      840,
      198,
      418,
      1538,
      749,
      811,
      1339,
      675,
      223,
      164,
      1467,
      933,
      1166,
      407,
      959,
      774,
      1037,
      1743,
      1727,
      472,
      1726,
      1682,
      720,
      846,
      85,
      195,
      1835,
      341,
      788,
      1632,
      888
  ],
  "target": 1177,
  "firstSolution": [
      341,
      195,
      223,
      418
  ],
  "time": 0.241
}