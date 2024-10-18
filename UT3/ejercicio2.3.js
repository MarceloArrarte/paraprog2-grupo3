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

async function main() {
    console.log('inicia');
    console.log(
        await waitFor(
            delay(1000),
            2000
        )
    );

    console.log(
        await waitFor(
            delay(2000, 'pepe'),
            1000
        ).catch(console.log)
    );

    console.log(
        await waitFor(
            Promise.reject(new Error('hace pum')),
            1000
        ).catch(console.log)
    );
}

main();