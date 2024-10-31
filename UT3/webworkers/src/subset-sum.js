import { workerFunction } from "./utils";

export function randomSubsetSumProblem(args) {
  const {
    length = 11,
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



function _naiveSubsetSum(list, target) {
  if (list.length == 0) {
    return null;
  }

  for (const n of list) {
    if (n == target) {
      return [n];
    }

    const rest = list.filter((x) => x != n);
    const solution = _naiveSubsetSum(rest, target - n);
    
    if (solution != null) {
      return [n, ...solution]
    }
  }
  
  return null;
}


export async function naiveSubsetSum(list, target) {
  if (list.length == 0) {
    return null;
  }

  const runSubsetSumWorker = workerFunction(_naiveSubsetSum);

  const promises = list.map(async n => {
    if (n == target) {
      return [n];
    }

    const rest = list.filter((x) => x != n);
    const solution = await runSubsetSumWorker(rest, target - n);
    
    if (solution != null) {
      return [n, ...solution]
    }
  });

  const results = await Promise.all(promises);
  const maybeSolution = results.find(res => !!res) ?? null;
  return maybeSolution;
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
  const [ns, target] = randomSubsetSumProblem();
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
