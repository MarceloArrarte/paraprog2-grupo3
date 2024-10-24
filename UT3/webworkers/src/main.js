import './style.css';
import {
  naiveSubsetSum, randomSubsetSumProblem, testSubsetSum,
} from './subset-sum';
import {
  newWorker, echoWorker, tickWorker, workerFunction,
} from './utils';

window.naiveSubsetSum = naiveSubsetSum;
window.randomSubsetSumProblem = randomSubsetSumProblem;
window.testSubsetSum = testSubsetSum;

window.newWorker = newWorker;
window.echoWorker = echoWorker;
window.tickWorker = tickWorker;
window.workerFunction = workerFunction;
