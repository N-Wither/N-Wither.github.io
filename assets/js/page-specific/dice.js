// Dices

function rollDice(index) {
    let diceToDisplay = document.getElementById(`dice-number-${index}`)
    let diceType = document.getElementById(`dice-${index}`).value
    if (diceType == 'none') {
        diceToDisplay.innerHTML = ''
        setDiceLabel(index, 0, 0)
        return
    }
    diceType = parseInt(diceType)
    disableButton(index)
    let time = 0
    let finalNumber = 0
    let minNum = 1
    let maxNum = diceType + 1
    // D10 Dices' min value is 0 and the max value is 9
    if (diceType == 10) { minNum = 0; maxNum = 10 }
    for (let i = 0; i < 10; i++) {
        let number = getRandomInt(minNum, maxNum)
        setTimeout(() => {
            diceToDisplay.innerHTML = `${(number)}`
            setDiceLabel(index, number, diceType)
        }, time)
        finalNumber = number
        time += 100
    }
    return finalNumber
}

function setDiceLabel(index, num, type) {
    let dice = document.getElementById(`dice-label-${index}`);
    if(type == 4) dice.innerHTML = '\uf6d0';
    else if (type == 6) {
        if (num == 1) dice.innerHTML = '\uf525';
        if (num == 2) dice.innerHTML = '\uf528';
        if (num == 3) dice.innerHTML = '\uf527';
        if (num == 4) dice.innerHTML = '\uf524';
        if (num == 5) dice.innerHTML = '\uf523';
        if (num == 6) dice.innerHTML = '\uf526';
    }
    else if (type == 8) dice.innerHTML = '\uf6d2';
    else if (type == 10) dice.innerHTML = '\uf6cd';
    else if (type == 12) dice.innerHTML = '\uf6ce';
    else if (type == 20) dice.innerHTML = '\uf6cf';
    else dice.innerHTML = ''
}

function disableButton(index) {
    let button = document.getElementById(`dice-roll-${index}`)
    let bigButton = document.getElementById('dice-roll-all')
    button.setAttribute('disabled', true)
    bigButton.setAttribute('disabled', true)
    setTimeout(() => {
        button.removeAttribute('disabled')
        bigButton.removeAttribute('disabled')
    }, 1000);
}

document.getElementById('dice-roll-all').onclick = () => {
    rollDice(1)
    rollDice(2)
    rollDice(3)
    rollDice(4)
}