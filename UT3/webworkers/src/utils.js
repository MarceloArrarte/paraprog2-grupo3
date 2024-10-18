export function newWorker(code) {
  if (!Worker || !Blob || typeof URL.createObjectURL !== 'function') {
    throw Error(`Please get a decent web browser.`);
  }
  const url = URL.createObjectURL(
    new Blob([`${code}`], { type: 'text/javascript' }),
  );
  return new Worker(url);
} // function newWorker

export function echoWorker() {
  const initWorker = () => {
    self.onmessage = ({ data }) => self.postMessage(data);
  };
  const worker = newWorker(`(${initWorker})();`);
  worker.onmessage = (event) => console.log(event.data);
  return worker;
} // function echoWorker

export function tickWorker(period = 500) {
  if (Number.isNaN(+period)) {
    throw new Error(`Invalid period ${period}!`);
  }
  const initWorker = (period) => {
    setInterval(() => self.postMessage(Date.now()), +period);
  };
  const worker = newWorker(`(${initWorker})(${+period});`);
  worker.onmessage = (event) => console.log(event.data);
  return worker;
} // function tickWorker

export function workerFunction(fn) {
  const code = `self.onmessage = ({ data }) => 
    self.postMessage((${fn}).call(self, ...data));`;
  return (...args) => new Promise((resolve) => {
    const worker = newWorker(code);
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
    worker.postMessage(args);
  });
} // function workerFunction
