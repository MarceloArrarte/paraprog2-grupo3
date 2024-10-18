function delay(ms, value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(value !== undefined ? value : Date.now()), ms);
    });
}


function waitFor(promise, timeout) {
    const timeoutRejection = delay(timeout)
        .then(() => { throw new Error(`Uncaught Error: Timeout after ${timeout}ms!`) });

    return Promise.race([promise, timeoutRejection])
}


async function retry(valueFn, retryFn) {
    let attempts = 0;
    let start = Date.now();
    let timeout = 15 * 1000;

    while (true) {
        try {
            return await waitFor(valueFn(), timeout);
        }
        catch (error) {
            attempts++;
            const delayTime = retryFn(attempts, Date.now() - start);

            if (delayTime < 0) { 
                throw error;
            }

            await delay(delayTime);
            console.log(`Intento ${attempts} fallido`);
        }
    }
}


async function main() {
    const testRuns = [
        validateTest(test1, { duration: 0, value: "pepe" }),
        validateTest(test2, { duration: 1000, value: "resolví" }),
        validateTest(test3, { duration: 3000, error: "Rechazo en test3" }),
        validateTest(test4, { duration: 0, error: "Rechazo en test4" }),
        validateTest(test5, { duration: 3000, error: "Rechazo en test5" }),
        validateTest(test6, { duration: 0, error: "Rechazo en test6" }),
        validateTest(test7, { duration: 3000, value: "La tercera es la vencida"}),
        validateTest(test8, { duration: 3000, error: "Rechazo en test8" }),
        validateTest(test9, { duration: 5000, error: "Rechazo en test9" }),
        validateTest(test10, { duration: 30000, error: "Rechazo en test10" })
    ];

    Promise.all(testRuns)
        .then(results => results.every(Boolean))
        .then(allPassed => {
            if (allPassed) {
                console.log('Todos pasaron');
            }
            else {
                console.log('Hubo errores');
            }
        })
}


async function validateTest(test, { duration: expDuration, value: expValue, error: expError }) {
    const start = Date.now();

    let result;
    
    try {
        result = await test();
    }
    catch (rejection) {
        if (expError === undefined) {
            console.log(`${test.name} - Unexpected error: ${rejection}`);
            return false;
        }
        
        if (!rejection?.message.startsWith(expError)) {
            console.log(`${test.name} - Expected error: ${expError}\nActual error: ${rejection}`);
            return false;
        }
    }

    const duration = Date.now() - start;

    const errorMargin = expDuration * 0.1 + 50;
    const minAllowed = Math.max(expDuration - errorMargin, 0);
    const maxAllowed = expDuration + errorMargin;

    if (duration < minAllowed || duration > maxAllowed) {
        console.log(`${test.name} - Expected duration was ${expDuration}, but was too far away: ${duration}`);
        return false;
    }
    
    if (expValue !== undefined && result != expValue) {
        console.log(`${test.name} - Expected result was ${expValue}, but actual result was ${result}`);
        return false;
    }

    return true;
}


//retry caso de prueba 1
//descripcion: La función retry debe retornar el valor de valueFn sin reintentos.
function test1() {
    return retry(
        () => Promise.resolve("pepe"),
        noRetry()
    );
}

//retry caso de prueba 2
//descripcion: retry debe reintentar una vez y luego retornar el valor cuando valueFn tenga éxito.
function test2() {
    let resuelve = false;
    return retry(
        () => {
            if (resuelve) {
                return Promise.resolve("resolví");
            } 
            else {
                resuelve = !resuelve;
                return Promise.reject();
            }
        },
        fixedBackoff()
    );
}


function test3() {
    return retry(
        () => Promise.reject(new Error("Rechazo en test3")),
        linearBackoff()
    );
}


//retry caso de prueba 4
//descripcion: retry debe rechazar el error sin reintentos porque retryFn devuelve 0.
function test4() {
    return retry(
        () => Promise.reject(new Error("Rechazo en test4")),
        noRetry()
    );
}


//Caso 5:
function test5() {
    return retry(
        () => Promise.reject(new Error("Rechazo en test5")),
        linearBackoff()
    );
}


function test6() {
    return retry(
        () => Promise.reject(new Error("Rechazo en test6")),
        immediateRetry()
    );
}


//Caso 7:
function test7() {
    let i = 0;
    return retry(
        () => ++i == 3 ? Promise.resolve("La tercera es la vencida") : Promise.reject(),
        linearBackoff()
    );
}


function test8() {
    return retry(
        () => Promise.reject(new Error("Rechazo en test8")),
        linearBackoff()
    );
}


function test9() {
    return retry(
        () => Promise.reject(new Error("Rechazo en test9")),
        exponentialBackoff()
    );
}


function test10() {
    return retry(
        () => Promise.reject(new Error("Rechazo en test10")),
        exponentialBackoff({ attempts: 5, timeout: 60 * 1000 })
    );
}


function noRetry() {
    return (attempts, elapsedTime) => {
        return -1;
    }
}


function immediateRetry({ attempts = 3, timeout = 30 * 1000 } = {}) {
    return (currentAttempts, elapsedTime) => {
        if (currentAttempts < attempts || elapsedTime > timeout) {
            return 0;
        }

        return -1;
    }
}


function fixedBackoff({ attempts = 3, timeout = 30 * 1000 } = {}) {
    return (currentAttempts, elapsedTime) => {
        if (currentAttempts < attempts || elapsedTime > timeout) {
            return 1000;
        }

        return -1;
    }
}


function linearBackoff({ attempts = 3, timeout = 30 * 1000 } = {}) {
    return (currentAttempts, elapsedTime) => {
        if (currentAttempts < attempts || elapsedTime > timeout) {
            return 1000 * currentAttempts;
        }

        return -1;
    }
}


function exponentialBackoff({ attempts = 3, timeout = 30 * 1000 } = {}) {
    return (currentAttempts, elapsedTime) => {
        if (currentAttempts < attempts || elapsedTime > timeout) {
            return 1000 * currentAttempts ** 2
        }
        
        return -1;
    }
}


main();