export function randomSubsetSumProblem(args) {
  const {
    length = 22,
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

export function* naiveSubsetSum(ns, target) {
  const xs = [...ns];
  while (xs.length > 0) {
    const x = xs.pop();
    if (x === target) {
      yield [x];
    }
    for (const result of naiveSubsetSum(xs, target - x)) {
      yield [x, ...result];
    }
  }
} // function naiveSubsetSum

export function testSubsetSum() {
  const [ns, target] = randomSubsetSumProblem();
  const startTime = Date.now();
  const firstSolution = naiveSubsetSum(ns, target).next().value ?? null;
  const time = (Date.now() - startTime) / 1e3;
  return { ns, target, firstSolution, time };
} // function testSubsetSum
