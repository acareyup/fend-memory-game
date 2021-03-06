/*
 * Create a list that holds all of your cards
 */
let iconArray = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor",
    "fa fa-bolt", "fa fa-bolt", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-cube", "fa fa-cube", "fa fa-bomb", "fa fa-bomb"
]

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const cards = document.querySelectorAll(".card");
shuffle(iconArray);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    for (let i = 0; i < cards.length; i++) {
        cards[i].firstElementChild.setAttribute("class", iconArray[i])
    }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let openCards = [];
let counter = 0;
let starter = true;
let timerRestart = false;

cards.forEach(function (el) {
    openCard(el);
    addCard(el);
    checkList(el);
})

//restart button functionality
const resetButton = document.querySelector(".restart");
resetButton.addEventListener("click", restart);

function restart() {
    let moves = document.getElementsByClassName("moves");
    moves[0].textContent = 0;
    counter = 0;
    openCards = [];
    shuffle(iconArray);
    let arr = document.querySelectorAll(".match");
    arr.forEach(function (params) {
        params.classList.remove("match");
    });
    let show = document.querySelectorAll(".open");
    show.forEach(function (params) {
        params.classList.remove("show", "open");
    });
    const stars = document.querySelectorAll(".fa-star");
    stars.forEach(function (params) {
        params.style.color = "black";
    })
    timerRestart = true;
    timer();
}

//give stars depending on move counter
function star() {
    const stars = document.querySelectorAll(".fa-star");
    if (counter < 20) {
        stars.forEach(function (el) {
            el.style.color = "orange";
        })
    } else if (counter < 35) {
        stars[0].style.color = "orange";
        stars[1].style.color = "orange";
        stars[2].style.color = "black"

    } else {
        stars[0].style.color = "orange";
        stars[1].style.color = "black"
    }
}

//open the cards 
function openCard(card) {
    card.addEventListener("click", function () {
        if (openCards.length < 2) {
            counter++;
            let moves = document.getElementsByClassName("moves");
            moves[0].textContent = counter;
            card.classList.toggle("show");
            card.classList.toggle("open");
            star();
            if (counter === 1) timer();
            //prevent time start again from begining
            starter = false;
            timerRestart = false;
        }
    })
}

//add card icons to the array
function addCard(el) {
    el.addEventListener("click", function () {
        let clicked_icon = this.firstElementChild.getAttribute("class");
        openCards.push(clicked_icon);
    })
}

//check the icon array if the second clicked icon is same
function checkList(el) {
    el.addEventListener("click", function () {
        if (openCards.length === 2) {
            cardMatch();
        }
    })
}
//matching cards if two icons are same otherwise hide cards
function cardMatch (params) {
    if (openCards[0] === openCards[1]) {
        //if clicked icons are same change the style and empty the array
        let match_check = document.querySelectorAll(".open");
        match_check.forEach(function (params) {
            params.classList.remove("open", "show");
            params.classList.add("match");
        });
        openCards = [];
        complete();
    } else {
        setTimeout(() => {
            //if clicked icons are not same close them and empty the opencards array after some time
            let match_check = document.querySelectorAll(".open");
            match_check.forEach(function name(params) {
                params.classList.remove("show", "open");
            });
            openCards = [];
        }, 750);
    }
}
//arrange message content after game finishes
function complete() {
    const arr = document.querySelectorAll(".match");
    if (arr.length === 16) {
        setTimeout(() => {
            document.querySelector(".alert-panel-hide").classList = "alert-container";
            document.querySelector(".moves-result").textContent = document.querySelector(".moves").textContent;
            document.querySelector(".star-result").innerHTML = document.querySelector(".stars").innerHTML;
            document.querySelector(".total-time").textContent = document.querySelector("#timer").textContent;
            timerRestart = true;
        }, 750)
    }
}
//play again button functionality
document.querySelector(".play-again").addEventListener("click", function () {
    restart();
    document.querySelector(".alert-container").classList = "alert-panel-hide";
})

//timer start and reset 
function timer() {
    if (starter == true) {
        let timer = 0;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        window.setInterval(function () {
            ++timer;
            hours = Math.floor(timer / 3600);
            minutes = Math.floor((timer - hours * 3600) / 60);
            seconds = timer - hours * 3600 - minutes * 60;
            if (hours < 10) hours = '0' + hours;
            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;
            document.querySelector('#timer').textContent = minutes + ':' + seconds;
            if (timerRestart) {
                document.querySelector('#timer').textContent = "00:00";
                timer = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
                return;
            }
        }, 1000);
    }
}