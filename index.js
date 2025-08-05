// === Instructions Popup ===

// Gets the elements for the instructions popup
const openInstructionsBtn = document.getElementById('openPopupBtn')
const closeInstructionsBtn = document.getElementById('closePopupBtn')
const InstructionsPopup = document.getElementById('popup')

// Gets the elements for the play popup
const openPlayBtn = document.getElementById('openPlayBtn')
const closePlayBtn = document.getElementById('closePlayPopupBtn')
const playPopup = document.getElementById('playPopup')
const body = document.body;

// === Play Menu ===

// When the user clicks on the "How To Play" button, the instructions popup is displayed
// The background is then blurred to focus the attention on the popup
// This popup explains the rules of the game
openInstructionsBtn.addEventListener('click', () => {
    InstructionsPopup.style.display = 'block';
    body.style.backgroundImage = "url('throne_w_blue_blur2.png')";
});
// When the user clicks on the "X" in the top right of the popup, the popup closes
// The background is then unblurred and goes back to the original
// This gives users the ability to exit the popup and return to the menu
closeInstructionsBtn.addEventListener('click', () => {
    InstructionsPopup.style.display = 'none';
    body.style.backgroundImage = "url('throne_w_blue.png')";
});
// When the user clicks on the "Play" button, a popup appears which allows the user to select different difficulty levels
// The background is blurred to focus the attention on the popup
// This allows users to choose what level they want to play based on their skill level
openPlayBtn.addEventListener('click', () => {
    playPopup.style.display = 'block';
    body.style.backgroundImage = "url('throne_w_blue_blur2.png')";
});
// When the user clicks on the "X" in the top right of the popup, the popup closes
// The background is then unblurred and goes back to the original
// This gives the users the control to exit the popup and return to the menu without starting a game
closePlayBtn.addEventListener('click', () => {
    playPopup.style.display = 'none';
    body.style.backgroundImage = "url('throne_w_blue.png')";
});

// === Game Difficulty Navagation ===

// Defines the easyBtn element
// When the user clicks on "Easy" it takes them to Level 1
const easyBtn = document.getElementById('easyBtn')
easyBtn.addEventListener('click', () => {
    window.location.href = 'level1.html';
});

// Defines the mediumBtn element
// When the user clicks on "Medium" it takes them to Level 2
// Allows users to scale the difficulty if they want a challenge
const mediumBtn = document.getElementById('mediumBtn')
mediumBtn.addEventListener('click', () => {
    window.location.href = 'level2.html';
});

// Defines the hardBtn element
// When the user clicks on "Hard" it takes them to Level 3
// Allows users to scale the difficulty if they want a challenge
const hardBtn = document.getElementById('hardBtn')
hardBtn.addEventListener('click', () => {
    window.location.href = 'level3.html';
});