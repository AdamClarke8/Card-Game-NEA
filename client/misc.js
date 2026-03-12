// OLD
/*
function sortByMana(arr, db) {
    // Get time in milliseconds before execution
    //let startTime = performance.now();

    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            let mana1 = db.getCardAttribute(arr[j], "mana");
            let mana2 = db.getCardAttribute(arr[j + 1], "mana");
            if (mana1 > mana2 || mana1 == mana2 && arr[j] > arr[j + 1]) {
                let temp = arr[j + 1];
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
        console.log(`Array: ${arr}`);
    }

    // Get time in milliseconds after execution
    let endTime = performance.now();

    let executionTime = endTime - startTime;
    db.scene.times.push(executionTime);
    //console.log(`Times: ${db.scene.times}`);

    // Calculate mean time to execute
    let sum = 0;
    db.scene.times.forEach(time => {
        sum += time;
    });

    let size = db.scene.times.length;
    //console.log(`Mean Time: ${sum / size}`);
    return arr;
}
*/

// NEW

function sortByMana(arr, db) {
    // Using insertion sort instead of bubble sort
    //console.log("Attempting to sort by mana.");

    // Get time in milliseconds before execution
    //let startTime = performance.now();

    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i; j >= 0; j--) {
            let mana1 = db.getCardAttribute(arr[j], "mana");
            let mana2 = db.getCardAttribute(arr[j + 1], "mana");
            if (mana1 > mana2 || mana1 == mana2 && arr[j] > arr[j + 1]) {
                let temp = arr[j + 1];
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
        console.log(`Array: ${arr}`);
    }
    /*
    // Get time in milliseconds after execution
    let endTime = performance.now();

    let executionTime = endTime - startTime;
    db.scene.times.push(executionTime);
    console.log(`Times: ${db.scene.times}`);

    // Calculate mean time to execute
    let sum = 0;
    db.scene.times.forEach(time => {
        sum += time;
    });

    let size = db.scene.times.length;
    console.log(`Mean Time: ${sum / size}`);
    */
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