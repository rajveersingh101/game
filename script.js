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

const words = [
  "application",
  "programming",
  "interface",
  "wizard",
  "element",
  "prototype",
  "callback",
  "undefined",
  "arguments",
  "settings",
  "selector",
  "container",
  "instance",
  "response",
  "console",
  "constructor",
  "token",
  "function",
  "return",
  "length",
  "type",
  "node",
];

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

// Handle enabling/disabling submit button based on name input validity
// Use "input" event not "change"
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


// Start game on name submit
nameSubmit.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!validateName(name)) {
    nameError.textContent = "Please enter a valid name (letters only, max 15 chars)";
    return;
  }
  playerName = name;
  // Push name_entered event to dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "name_entered",
    name: playerName,
  });
  // Switch screens
  nameScreen.style.display = "none";
  gameScreen.style.display = "block";
  startGame();
});

function startGame() {
  selectedWord = words[Math.floor(Math.random() * words.length)];
  playable = true;
  correctLetters.splice(0);
  wrongLetters.splice(0);
  displayWord();
  updateWrongLettersElement();
  createKeyboard();
  popup.style.display = "none";
  notification.classList.remove("show");
}

// Generate the on-screen keyboard buttons A-Z
function createKeyboard() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  keyboardContainer.innerHTML = "";
  letters.forEach((letter) => {
    const button = document.createElement("button");
    button.classList.add("keyboard-button");
    button.innerText = letter.toUpperCase();
    button.setAttribute("data-letter", letter);
    button.addEventListener("click", () => {
      if (playable) handleLetter(letter);
    });
    keyboardContainer.appendChild(button);
  });
}

// Display the hidden word with correctly guessed letters
function displayWord() {
  wordElement.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ""}
          </span>
        `
      )
      .join("")}
  `;

  const innerWord = wordElement.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    finalMessage.innerText = `Congratulations ${playerName}! You won! 😃`;
    finalMessageRevealWord.innerText = "";
    popup.style.display = "flex";
    playable = false;
    // Push name_guessed event to dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "name_guessed",
      name: playerName,
    });
  }
}

// Update wrong letters display and hangman figure parts
function updateWrongLettersElement() {
  wrongLettersElement.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`).join(" ")}
  `;

  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    index < errors
      ? (part.style.display = "block")
      : (part.style.display = "none");
  });

  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = `Sorry ${playerName}, you lost. 😕`;
    finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
    // Push name_not_guessed event to dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "name_not_guessed",
      name: playerName,
    });
  }
}

// Show "already entered letter" notification
function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Handle letter input logic common for keyboard and on-screen
function handleLetter(letter) {
  if (selectedWord.includes(letter)) {
    if (!correctLetters.includes(letter)) {
      correctLetters.push(letter);
      displayWord();
      disableKeyboardButton(letter);
    } else {
      showNotification();
    }
  } else {
    if (!wrongLetters.includes(letter)) {
      wrongLetters.push(letter);
      updateWrongLettersElement();
      disableKeyboardButton(letter);
    } else {
      showNotification();
    }
  }
}

// Disable a keyboard button after it has been clicked
function disableKeyboardButton(letter) {
  const button = keyboardContainer.querySelector(
    `button[data-letter="${letter}"]`
  );
  if (button) {
    button.classList.add("disabled");
    button.disabled = true;
  }
}

// Listen for physical keyboard events (desktop)
window.addEventListener("keypress", (e) => {
  if (playable) {
    const letter = e.key.toLowerCase();
    if (letter >= "a" && letter <= "z") {
      handleLetter(letter);
    }
  }
});

// Restart the game
playAgainButton.addEventListener("click", () => {
  startGame();
});
