// Add the ability for the user to return to the menu page from Level 3 easily
// I chose 'window.location.href' as it is the simplest way to navigate between pages
// This gives the user full control and allows them to exit the game at any time. 
const homeBtn = document.getElementById('homeBtn');
homeBtn.addEventListener('click', () => {
    window.location.href = 'menu.html';
});

// Stores card elements and game state
// 'lockBoard' prevents multiple cards from being flipped while it checks for a match
// 'gameEnded' stops the game when the timer runs out
// These help prevent bugs like double-clicking to occur
const gridContainer = document.querySelector(".gridContainer");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let gameEnded = false;
let score = 0;
let matchedPairs = 0;

// Displays the initial score at the start of the game
// Uses 'textContent' to update UI elements in real-time
document.querySelector(".score").textContent = score;

// Loads to JSON data which contains all the card names and images, it then picks all 12 pairs (in total 24 cards)
// fetch() is used to keep the card data in a separate JSON file, which makes it easier to use across multiple levels
fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    const selectedCards = getRandomCards(data, 12)
    cards = [...selectedCards, ...selectedCards]; // Duplicates the cards to then make the pairs
    shuffle(cards); // Randomises the position of the cards
    generateCards(); // Generates the cards onto the page
    startTimer(); // Begins the countdown
  });

// Randomly selects a certain amount of cards from the full card dataset
// 'Math.random()' and '.sort()' together shuffle the array to get a random selection of cards
// This ensures that every game is a unique game
function getRandomCards(data, count) {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Standard shuffle algorithm to randomise the card order
// Makes it so that there aren't any predictable positions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i +1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Reshuffles the cards when the game is restarted
// Prevents predictable card positions, ensuring that it is completely randomised
// It's separated from the initial shuffle in fetch() so then the game can reshuffle cards on restart without duplicating the fetch and pairing logic
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// Generates the cards and adds them to the grid container
// Each card is given a class for styling
// The front of the card is styled by the image (loaded from the card dataset), and the back is styled by CSS
// An event listener is added to each card, so when the card is clicked it flips over
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="frontImage" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

// Flips the card when the user clicks on them
// Prevents flipping more than two cards and re-flipping the same card
// '.classList.add("flipped")' is to animate the flip of the card via CSS
function flipCard() {
  if (lockBoard || gameEnded) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++; // When two cards are flipped the score increases by 1
  document.querySelector(".score").textContent = score;
  lockBoard = true; // The user can't reflip the card once it has been flipped

  checkForMatch();
}

// Checks if two flipped cards are the same by comparing their data name and attributes
// If it is a match, it disables the cards; otherwise it unflips
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

// Disables matched cards so that they are still flipped over
// Increases matchedPairs and increases the time by 3 seconds
// I chose a 3-second time bonus to reward the use, because it wasn't too large or too small
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matchedPairs++;
  increaseTime(3);
  resetBoard();
    // If all pairs are matched, the game ends and the popup according to the score is displayed
    if (matchedPairs === 12) {
    setTimeout(() => {
      clearInterval(timeInterval) // The timer is stopped
      showEndPopup(score);
    }, 1000); // A small delay to still show the animation of the card flipping
  }
}

// Resets unmatched cards by removing the class "flipped" after a small delay of 1000ms (1s)
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// Resets the turn state of the cards so that the user can continue flipping them
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Resets everything to its original state so that the user can retry 
function restart() {
  const popupFail = document.getElementById("popupFail")
  const popupAgain = document.getElementById("popupAgain")
  const popupWin = document.getElementById("popupWin")
  
  // Clears all the popups
  popupWin.style.display = 'none';
  popupAgain.style.display = 'none';
  popupFail.style.display = 'none';

  clearInterval(timeInterval); // Stops the timer
  timeLeft = 50; // Resets the countdown back to the original number
  document.getElementById("timer").textContent = `Time: ${timeLeft}`;
  startTimer(); // Starts the timer
  
  // Makes it so that the cards are clickable
  // All scores are set to 0
  // The cards are randomised
  gameEnded = false;
  matchedPairs = 0
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}

// Shows the end popup based on the user score performance
function showEndPopup(score) {
  clearInterval(timeInterval); // Stops the timer
  gameEnded = true; // Makes it so that the cards aren't able to be clicked

  const buttonFail = document.getElementById("buttonFail")
  const buttonAgain = document.getElementById("buttonAgain")
  const buttonHome = document.getElementById("buttonHome")
  const buttonTryAgain = document.getElementById("buttonTryAgain")

  const failSound = document.getElementById("failSound")
  const againSound = document.getElementById("againSound")
  const beatSound = document.getElementById("beatSound")

  // Depending on the score, the popup and audio would be different
  // Each popup would also have different button options
  // This ensures that the difficulty remains balanced
  // A Win is when the score is from 12 to 22
  if (score >= 12 && score <= 22) {
    beatSound.play();
    popupWin.style.display = 'block';
    buttonAgain.onclick = () => restart() // Restarts the entire game if the "Try Again" button is clicked
    buttonHome.onclick = () => window.location.href = "menu.html"; // Naviagtes to the Menu when the "Return Home" button is clicked
  } 
  // An Average is when the score is from 23 to 32
  else if (score >= 23 && score <= 32) {
    againSound.play();
    popupAgain.style.display = 'block';
    buttonTryAgain.onclick = () => restart(); // Restarts the entire game if the "Try Again" button is clicked
  } 
  // A loss is when the score is 33 or higher
  else if (score >= 33 ) {
    failSound.play();
    popupFail.style.display = 'block';    
    buttonFail.onclick = () => window.location.href = "level2.html"; // Navigates to the Medium Level when the "Go down" button is clicked
  }

}

// Gives the users control to close the popup manually
// This then gives them the option to either go back to the menu or restart
const closePopupWin = document.getElementById('closePopupWin')
  closePopupWin.addEventListener('click', () => {
      popupWin.style.display = 'none';
  });
  const closePopupAgain = document.getElementById('closePopupAgain')
  closePopupAgain.addEventListener('click', () => {
      popupAgain.style.display = 'none';
  });
  const closePopupFail = document.getElementById('closePopupFail')
  closePopupFail.addEventListener('click', () => {
      popupFail.style.display = 'none';
  });

// Sets the timer to be 50 seconds
let timeLeft = 50
let timeInterval;

// Starts the timer
// 'setInterval()' runs every 1000ms (1s) to update the timer and display the countdown
function startTimer() {
  document.getElementById("timer").textContent = `Time: ${timeLeft}`;
  timeInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time: ${timeLeft}`;

    // If the timer reaches 0, the game ends with the fail state
    if (timeLeft <= 0) {
      clearInterval(timeInterval);
      endgame("fail");
    }
  }, 1000);
}

// Adds bonus seconds when a pair is correctly matched
function increaseTime(seconds) {
  timeLeft += seconds;
  document.getElementById("timer").textContent = `Time: ${timeLeft}`;
}

// Triggers fail when the timer runs out.
function endgame(result) {
  gameEnded = true; // Stops the user from flipping the cards again

  // If the user fails, the the fail popup is displayed, and the fail audio is played
  if (result === "fail") {
    document.querySelector(".popupFail").style.display = "block";
    document.getElementById("failSound").play()

    const buttonFail = document.getElementById("buttonFail");
    buttonFail.onclick = () => {
      window.location.href = "level2.html"; // Sends the user back to the Medium level if the "Go down a Level" button is clicked
    }
  }
}

// If the user clicks outside of the grid, popup, or buttons, it shows an alert
// This helps people who are lost or confused about the game and guides them to the instructions. It improves the usability of the game.
// '.contains()' is used to check if the click was inside the specific elements
document.addEventListener("click", function (event) {
  const clickedInsideGameElements = 
    document.querySelector(".gridContainer").contains(event.target) ||
    document.querySelector(".actions").contains(event.target) ||
    document.querySelector("#homeBtnContainer").contains(event.target) ||
    document.querySelector("#popupWin").contains(event.target) ||
    document.querySelector("#popupAgain").contains(event.target) ||
    document.querySelector("#popupFail").contains(event.target);

  // If the click was not in those elements then the alert is shown.
  if (!clickedInsideGameElements) {
    alert("If you don't know how to play the game, head back to the menu and view the Instructions!");
  }
});





