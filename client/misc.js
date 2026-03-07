function sortByMana(arr, db) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (db.getCardAttribute(arr[j], "mana") > db.getCardAttribute(arr[j + 1], "mana")) {
                let temp = arr[j + 1];
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
        console.log(`Array: ${arr}`);
    }
    return arr;
}

export {
    sortByMana
}