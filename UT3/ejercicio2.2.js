function delay(ms, value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(value !== undefined ? value : Date.now()), ms);
    });
}

async function main() {
    console.log('inicia');
    console.log(await delay(1000));
    console.log(await delay(2000, 'pepe'));
}

main();