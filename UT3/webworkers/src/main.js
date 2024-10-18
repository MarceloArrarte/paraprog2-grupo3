import './style.css'
import {
  newWorker, echoWorker, tickWorker, workerFunction,
} from './utils';

window.newWorker = newWorker;
window.echoWorker = echoWorker;
window.tickWorker = tickWorker;
window.workerFunction = workerFunction;