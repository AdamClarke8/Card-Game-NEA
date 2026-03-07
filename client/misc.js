function sortByMana(arr, db) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (db.getCardAttribute(arr[i], "mana") > db.getCardAttribute(arr[j], "mana")) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

export {
    sortByMana
}