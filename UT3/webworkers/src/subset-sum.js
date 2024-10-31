import { workerFunction } from "./utils";

export function randomSubsetSumProblem(args) {
  const {
    length = 26,
    maxValue = 500,
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
      const maybeSolution = _naiveSubsetSum(copy, target - n);
      if (maybeSolution) {
        return [n, ...maybeSolution];
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
  const [ns, target] = randomSubsetSumProblem();
  // const {ns, target} = problem;

  const startTime = Date.now();
  // const firstSolution = sequentialNaiveSubsetSum(ns, target).next().value ?? null;
  const firstSolution = await parallelNaiveSubsetSum(ns, target);

  const time = (Date.now() - startTime) / 1e3;
  return { ns, target, firstSolution, time };
} // function testSubsetSum

let problem = {
  "ns": [
      438,
      348,
      296,
      397,
      484,
      94,
      254,
      148,
      140,
      209,
      126,
      61,
      25,
      196,
      193,
      338,
      342,
      3,
      29,
      498,
      476,
      176,
      240,
      475,
      199
  ],
  "target": 413,
  "firstSolution": [
      193,
      126,
      94
  ],
  "time": 0.188
}