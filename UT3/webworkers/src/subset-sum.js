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

export async function naiveSubsetSum(list, target) {
  const runSubsetSumWorker = workerFunction(_naiveSubsetSum);

  const copy = [...list]

  while (copy.length > 0) {
    const n = copy.pop();
    if (n == target) {
      return [n];
    }
    else {
      const maybeSolution = await runSubsetSumWorker(copy, target - n);
      if (maybeSolution) {
        return [n, ...maybeSolution];
      }
    }
  }

  return null;
}

export async function naiveSubsetSum(list, target) {
  const runSubsetSumWorker = workerFunction(_naiveSubsetSum);

  const copy = [...list]

  while (copy.length > 0) {
    const n = copy.pop();
    if (n == target) {
      return [n];
    }
    else {
      const maybeSolution = await runSubsetSumWorker(copy, target - n);
      if (maybeSolution) {
        return [n, ...maybeSolution];
      }
    }
  }

  return null;
}



// export function* naiveSubsetSum(ns, target) {
//   const xs = [...ns];
//   while (xs.length > 0) {
//     const x = xs.pop();
//     if (x === target) {
//       yield [x];
//     }
//     for (const result of naiveSubsetSum(xs, target - x)) {
//       yield [x, ...result];
//     }
//   }
// } // function naiveSubsetSum

export async function testSubsetSum() {
  // const [ns, target] = randomSubsetSumProblem();
  const {ns, target} = problem;
  // const [ns, target] = [[3, 34, 4, 12, 5, 2], 9]
  // const [ns, target] = [[3, 1, 5, 9, 12, 7, 2, 4, 10, 6, 8], 15]
  // const [ns, target] = [[3, 1, 5, 9, 12, 7, 2, 4, 10, 6, 8, 20, 30], 65]
  // const [ns, target] = [[3, 5, 1, 8, 4, 2, 6, 9, 7, 10, 12, 14, 11, 13], 20]
  // const [ns, target] = [[2, 4, 7, 1, 10, 3, 5, 12, 8, 6, 11, 14, 9, 13, 15], 23]

  const startTime = Date.now();
  // const firstSolution = naiveSubsetSum(ns, target).next().value ?? null;

  const firstSolution = await naiveSubsetSum(ns, target);
  const time = (Date.now() - startTime) / 1e3;
  return { ns, target, firstSolution, time };
} // function testSubsetSum

let problem = {
  "ns": [
      345,
      21,
      449,
      59,
      405,
      385,
      60,
      250,
      64,
      282,
      304,
      230,
      110,
      0,
      437,
      326,
      44,
      410,
      30,
      389,
      478,
      381,
      442,
      377,
      448
  ],
  "target": 103,
  "firstSolution": [
      44,
      0,
      59
  ],
  "time": 6.437
}