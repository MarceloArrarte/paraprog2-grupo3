import './style.css';
import {
  sequentialNaiveSubsetSum, parallelNaiveSubsetSum, randomSubsetSumProblem, testSubsetSum,
} from './subset-sum';
import {
  newWorker, echoWorker, tickWorker, workerFunction,
} from './utils';

window.sequentialNaiveSubsetSum = sequentialNaiveSubsetSum;
window.parallelNaiveSubsetSum = parallelNaiveSubsetSum;
window.randomSubsetSumProblem = randomSubsetSumProblem;
window.testSubsetSum = testSubsetSum;

window.newWorker = newWorker;
window.echoWorker = echoWorker;
window.tickWorker = tickWorker;
window.workerFunction = workerFunction;
