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

function sortCardList(player, cardNames, db) {
    // Sort cards by ascending mana
    const cardList1 = [];
    const cardList2 = [];

    cardNames.forEach((cardName) => {
        if (player.deck.getNumCopies(cardName) > 0) {
            cardList1.push(cardName);
        }
        else {
            cardList2.push(cardName);
        }
    })

    sortByMana(cardList1, db);
    sortByMana(cardList2, db);

    console.log(`Card list 1: ${cardList1}`);
    console.log(`Card list 2: ${cardList2}`);

    const newCardList = cardList1.concat(cardList2);
    console.log(`New card list: ${newCardList}`);

    return newCardList;
}

export {
    sortByMana,
    sortCardList
}