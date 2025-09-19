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

let selectedWord = words[Math.floor(Math.random() * words.length)];
let playable = true;
const correctLetters = [];
const wrongLetters = [];

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
    finalMessage.innerText = "Congratulations! You won! 😃";
    finalMessageRevealWord.innerText = "";
    popup.style.display = "flex";
    playable = false;
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
    finalMessage.innerText = "Unfortunately you lost. 😕";
    finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
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
  playable = true;
  correctLetters.splice(0);
  wrongLetters.splice(0);
  selectedWord = words[Math.floor(Math.random() * words.length)];
  displayWord();
  updateWrongLettersElement();
  popup.style.display = "none";
  createKeyboard();
});

// Initialize game
displayWord();
updateWrongLettersElement();
createKeyboard();
