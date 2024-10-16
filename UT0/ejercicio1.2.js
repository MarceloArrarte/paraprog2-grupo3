/**
 * @param {(number | [])[]} list 
 */
function treeMinRecursive(list) {
    if (list.length === 0) {
        return Number.POSITIVE_INFINITY;
    }
    
    return Math.min(
        ...list.map(elem => Array.isArray(elem) ? treeMinRecursive(elem) : elem)
    );
}


/**
 * @param {(number | [])[]} list 
 */
function treeMinIterative(list) {
    let min = Number.POSITIVE_INFINITY;

    let i = 0;
    while (i < list.length) {
        const elem = list[i];
        if (typeof elem === 'number') {
            if (elem < min) {
                min = elem;
            }
        }
        else {
            list.push(...elem);
        }

        i++;
    }

    return min;
}



listas = [
    [1, 7, [-1]],
    [[[0], 1], 2],
    [],
    [[], [[]], 999]
];

for (let i = 0; i < listas.length; i++) {
    const lista = listas[i];
    console.log(`Lista Recursivo: ${treeMinRecursive(lista)}, Iterativo: ${treeMinIterative(lista)}`);
}