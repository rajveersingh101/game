const nameScreen = document.getElementById("name-screen");
const nameInput = document.getElementById("name-input");
const nameSubmit = document.getElementById("name-submit");
const nameError = document.getElementById("name-error");

const gameScreen = document.getElementById("game-screen");
const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const playAgainButton = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById("final-message-reveal-word");
const figureParts = document.querySelectorAll(".figure-part");
const keyboardContainer = document.getElementById("keyboard");

let selectedWord = "";
let playable = false;
const correctLetters = [];
const wrongLetters = [];
let playerName = "";

// Validate name input - only letters, max 15 chars
function validateName(name) {
  const regex = /^[a-zA-Z]{1,15}$/;
  return regex.test(name);
}

// Enable/disable start button based on validity
nameInput.addEventListener("input", () => {
  const value = nameInput.value.trim();
  if (validateName(value)) {
    nameSubmit.disabled = false;
    nameError.textContent = "";
  } else {
    nameSubmit.disabled = true;
    if (value.length > 0) {
      nameError.textContent = "Use letters only (1-15 chars)";
    } else {
      nameError.textContent = "";
    }
  }
});

// Fetch a random word from external API
async function fetchRandomWord() {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
    const data = await response.json();
    const word = data[0].toLowerCase();
    if (/^[a-z]{3,15}$/.test(word)) {
      return word;
    } else {
      return fetchRandomWord(); // recursive retry if invalid word
    }
  } catch (error) {
    console.error('Error fetching random word:', error);
    return 'javascript'; // fallback word
  }
}

// Start game - async to wait word fetch
async function startGame() {
  selectedWord = await fetchRandomWord();
  playable = true;
  correctLetters.splice(0);
  wrongLetters.splice(0);
  displayWord();
  updateWrongLettersElement();
  createKeyboard();
  popup.style.display = "none";
  notification.classList.remove("show");
}

// On clicking start button on name screen
nameSubmit.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  if (!validateName(name)) {
    nameError.textContent = "Please enter a valid name (letters only, max 15 chars)";
    return;
  }
  playerName = name;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "name_entered", name: player
