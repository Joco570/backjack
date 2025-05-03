let player = {
  name: "Joe",
  chips: 100,
};

let cards = [];
let fullDeck = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let isDealerAlive = false;
let dealerHasBlackJack = false;
let hasStood = false;
let message = "";
let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");
let playerEl = document.getElementById("player-el");
let countEl = document.getElementById("count-el");
let dealerCardsEl = document.getElementById("dealer-el");
let dealerSumEl = document.getElementById("dealer-sum-el");
let cardCount = 0;

playerEl.textContent = player.name + ": $" + player.chips;
countEl.textContent = "Count: " + cardCount;

function getCount(card) {
  let value = card.slice(0, -1);
  if (["2", "3", "4", "5", "6"].includes(value)) return 1;
  else if (["10", "J", "Q", "K", "A"].includes(value)) return -1;
  else return 0;
}

function createDeck() {
  let suits = ["♠", "♥", "♦", "♣"];
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  fullDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      fullDeck.push(value + suit);
    }
  }
}

function shuffleDeck() {
  for (let i = fullDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
  }
  console.log("Deck shuffled");
  cardCount = 0;
}

function getCountValue(card) {
  const value = card.slice(0, -1);
  if (["J", "Q", "K"].includes(value)) return 10;
  if (value === "A") return 11;
  return parseInt(value);
}

function calculateCardValue(cards) {
  let sum = 0;
  let aceCount = 0;
  for (let card of cards) {
    const v = getCountValue(card);
    sum += v;
    if (card.slice(0, -1) === "A") aceCount++;
  }
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount--;
  }
  return sum;
}

function calculateDealerValue(dealerCards) {
  let sum = 0;
  let aceCount = 0;
  for (let card of dealerCards) {
    const v = getCountValue(card);
    sum += v;
    if (card.slice(0, -1) === "A") aceCount++;
  }
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount--;
  }
  return sum;
}

function drawCard() {
  const card = fullDeck.pop();
  cardCount += getCount(card);
  countEl.textContent = "Count: " + cardCount;
  //return fullDeck.pop();
  return card;
}

//no longer necessary to have a separate function for random card generation, leaving in for posterity
/*function getRandomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  if (randomNumber > 10) {
    return 10;
  } else if (randomNumber === 1) {
    return 11;
  } else {
    return randomNumber;
  }
}*/

function startGame() {
  isAlive = true;
  hasStood = false;
  hasBlackJack = false;
  isDealerAlive = true;
  dealerHasBlackJack = false;
  createDeck();
  shuffleDeck();
  cards = [];
  dealerCards = [];
  let firstCard = drawCard();
  let secondCard = drawCard();
  let dealerFirstCard = drawCard();
  //let dealerSecondCard = drawCard();
  cards.push(firstCard, secondCard);
  dealerCards.push(dealerFirstCard);
  sum = calculateCardValue(cards);
  dealerSum = calculateDealerValue(dealerCards);
  player.chips -= 10;
  playerEl.textContent = player.name + ": $" + player.chips;
  console.log("Player's cards dealt");
  renderGame();
}

function newHand() {
  if (fullDeck.length > 2) {
    hasStood = false;
    isAlive = true;
    hasBlackJack = false;
    player.chips -= 10;
    playerEl.textContent = player.name + ": $" + player.chips;
    cards = [];
    dealerCards = [];
    let firstCard = drawCard();
    let secondCard = drawCard();
    let dealerFirstCard = drawCard();
    cards.push(firstCard, secondCard);
    dealerCards.push(dealerFirstCard);
    sum = calculateCardValue(cards);
    dealerSum = calculateDealerValue(dealerCards);
    renderGame();
  } else {
    messageEl.textContent =
      "Not enough cards left in the deck to start a new hand. Please shuffle deck.";
  }
}

function renderGame() {
  cardsEl.textContent = "Your Cards: ";

  for (let i = 0; i < cards.length; i++) {
    cardsEl.textContent += cards[i] + " ";
    //dealerCardsEl.textContent += dealerCards[i] + " ";
  }
  dealerCardsEl.textContent = "Dealer's Cards: ";
  for (let i = 0; i < 1; i++) {
    dealerCardsEl.textContent += dealerCards[i] + " ";
  }

  sumEl.textContent = "Your Total: " + sum;
  dealerSumEl.textContent = "Dealer's Total: " + dealerSum;

  if (sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    message = "You've got Blackjack!";
    hasBlackJack = true;
    player.chips += 20;
    stand();
    playerEl.textContent = player.name + ": $" + player.chips;
  } else {
    message = "You Bust! The House Wins :( ";
    isAlive = false;
  }
  messageEl.textContent = message;
}

function stand() {
  if (!isAlive || hasStood) return;
  hasStood = true;
  while (isDealerAlive && dealerSum < 17 && isAlive) {
    let newDealerCard = drawCard();
    dealerCards.push(newDealerCard);
    dealerSum = calculateDealerValue(dealerCards);
    dealerCardsEl.textContent = "Dealer's Cards: ";
    for (let i = 0; i < dealerCards.length; i++) {
      dealerCardsEl.textContent += dealerCards[i] + " ";
    }
    dealerSumEl.textContent = "Dealer's Total: " + dealerSum;
  }

  if (dealerSum > sum && dealerSum <= 21) {
    message = "Dealer wins!";
    messageEl.textContent = message;
    isAlive = false;
  } else if (dealerSum > 21) {
    message = "Dealer Busts! You win!";
    messageEl.textContent = message;
    isAlive = false;
  } else if (dealerSum === sum) {
    message = "It's a tie! The House Wins!";
    messageEl.textContent = message;
    isAlive = false;
  } else {
    message = "You win!";
    messageEl.textContent = message;
    player.chips += 20;
    playerEl.textContent = player.name + ": $" + player.chips;
    isAlive = false;
  }
}

function newCard() {
  if (isAlive && !hasBlackJack && fullDeck.length > 0) {
    let card = drawCard();
    cards.push(card);
    sum = calculateCardValue(cards);
    renderGame();
  }
}
