// ---------------------
// Selección de elementos del DOM
// ---------------------
const qrScreen       = document.getElementById("qrScreen");
const gameScreen     = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const resultsScreen  = document.getElementById("resultsScreen");

const startGameBtn   = document.getElementById("startGameBtn");

const gameBoard      = document.getElementById("gameBoard");
const timerElement   = document.getElementById("timer");

let flippedCards = [];
let matchedCount = 0;
let timer;
let totalSeconds = 0;
let isGameActive = false;

// ---------------------
// Generar el array con imágenes duplicadas  
// Se usan 10 imágenes (10 parejas = 20 cartas)
function generateCardsArray() {
  const images = [
    "attendance.png",
    "benefits.png",
    "capacitations.png",
    "surveys.png",
    "hiring.png",
    "onboarding.png",
    "payment.png",
    "performance.png",
    "recognition.png",
    "signature.png"
  ];
  const duplicatedImages = [...images, ...images];
  return shuffleArray(duplicatedImages);
}

// ---------------------
// Algoritmo de Fisher-Yates para mezclar
// ---------------------
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ---------------------
// Crear y mostrar las cartas en el DOM
// ---------------------
function createBoard() {
  gameBoard.innerHTML = "";
  matchedCount = 0;
  flippedCards = [];

  const cardImages = generateCardsArray();

  cardImages.forEach((imgName) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    // Lado trasero: se muestra reverse.png (imagen oculta)
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    const backImg = document.createElement("img");
    backImg.src = "img/reverse.png";
    backImg.alt = "Reverso";
    cardBack.appendChild(backImg);

    // Lado frontal: se muestra la imagen asignada a la carta
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    const frontImg = document.createElement("img");
    frontImg.src = "img/" + imgName;
    frontImg.alt = imgName;
    cardFront.appendChild(frontImg);

    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    cardElement.appendChild(cardInner);

    // Evento para voltear la carta
    cardElement.addEventListener("click", () => flipCard(cardElement, imgName));

    gameBoard.appendChild(cardElement);
  });
}

// ---------------------
// Manejar el volteo de una carta
// ---------------------
function flipCard(cardElement, imgName) {
  if (cardElement.classList.contains("flipped") || flippedCards.length === 2) {
    return;
  }

  cardElement.classList.add("flipped");
  flippedCards.push({ cardElement, imgName });

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

// ---------------------
// Verificar si las dos cartas coinciden
// ---------------------
function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.imgName === card2.imgName) {
    matchedCount += 2;

    // Explosión de confetti al encontrar un match
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    flippedCards = [];

    if (matchedCount === 20) {
      endGame();
    }
  } else {
    setTimeout(() => {
      card1.cardElement.classList.remove("flipped");
      card2.cardElement.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}

// ---------------------
// Iniciar el juego
// ---------------------
function startGame() {
  createBoard();
  startTimer();
  isGameActive = true;
}

// ---------------------
// Manejo del cronómetro
// ---------------------
function startTimer() {
  clearInterval(timer);
  totalSeconds = 0;
  timer = setInterval(() => {
    totalSeconds++;
    displayTime(totalSeconds);
  }, 1000);
}

function displayTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  const formattedTime = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  timerElement.textContent = `Tiempo: ${formattedTime}`;
}

// ---------------------
// Finalizar el juego y gestionar las pantallas de finalización
// ---------------------
function endGame() {
  clearInterval(timer);
  isGameActive = false;

  gameScreen.style.display = "none";
  gameOverScreen.style.display = "block";

  setTimeout(() => {
    gameOverScreen.style.display = "none";
    resultsScreen.style.display = "block";

    setTimeout(() => {
      resultsScreen.style.display = "none";
      qrScreen.style.display = "block";
      qrInput.value = "";
    }, 3000);
  }, 3000);
}

// ---------------------
// Evento para iniciar el juego desde la pantalla QR
// ---------------------
startGameBtn.addEventListener("click", () => {
  qrScreen.style.display = "none";
  gameScreen.style.display = "block";
  startGame();
});
