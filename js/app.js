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
  if (!isGameActive) return;
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

    // Obtener la posición de la última carta (card2)
    const rect = card2.cardElement.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    // Dispara el confetti usando el centro de card2 como origen
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: originX, y: originY }
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
  // Crear el tablero; por defecto, las cartas están ocultas (sin "flipped")
  createBoard();

  // Desactivar la interacción del usuario mientras se muestra la previsualización
  isGameActive = false;

  // Seleccionar todas las cartas del tablero
  const allCards = document.querySelectorAll('.card');

  // Paso 1: Esperar 1 segundo con las cartas ocultas
  setTimeout(() => {
    // Paso 2: Voltear todas las cartas para mostrarlas
    allCards.forEach(card => card.classList.add('flipped'));

    // Después de 2 segundos, volver a ocultarlas y activar el juego
    setTimeout(() => {
      allCards.forEach(card => card.classList.remove('flipped'));
      startTimer();       // Inicia el cronómetro
      isGameActive = true; // Habilita la interacción con las cartas
    }, 3000);
  }, 1000);
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
  timerElement.textContent = formattedTime;
}

// ---------------------
// Finalizar el juego y gestionar las pantallas de finalización
// ---------------------
function endGame() {
  clearInterval(timer);
  isGameActive = false;
  
  // Seleccionamos los elementos que animaremos
  const timeBanner = document.querySelector('.time-banner');
  const board = document.getElementById("gameBoard");
  
  // 1. Animar: time-banner sube y el tablero se desplaza a la izquierda (1s)
  timeBanner.classList.add('slide-up');
  board.classList.add('slide-left');
  
  // Después de 1 segundo, ocultamos el juego y mostramos gameOverScreen
  setTimeout(() => {
    gameScreen.style.display = "none";
    
    // 2. gameOverScreen aparece desde la derecha
    gameOverScreen.style.display = "flex";
    gameOverScreen.classList.add('slide-in-from-right');
  }, 1000);
  
  // Después de 4 segundos (1s de animación inicial + 3s mostrando gameOverScreen):
  setTimeout(() => {
    // 3. gameOverScreen se desplaza hacia la izquierda para desaparecer
    gameOverScreen.classList.remove('slide-in-from-right');
    gameOverScreen.classList.add('slide-out-to-left');
  }, 4000);
  
  // Después de 5 segundos, ocultamos gameOverScreen y mostramos resultsScreen
  setTimeout(() => {
    gameOverScreen.style.display = "none";
    document.getElementById("finalTime").textContent = timerElement.textContent;
    resultsScreen.style.display = "flex";
    // 4. resultsScreen aparece desde la izquierda
    // resultsScreen.classList.add('slide-in-from-right');
  }, 5000);
  
  // Después de 3 segundos mostrando resultsScreen, ocultamos resultsScreen y mostramos qrScreen
  setTimeout(() => {
    resultsScreen.style.display = "none";
    qrScreen.style.display = "flex";
  }, 10000);
}




// ---------------------
// Evento para iniciar el juego desde la pantalla QR
// ---------------------
startGameBtn.addEventListener("click", () => {
  // Elimina las clases de animación que se hayan quedado en los elementos
  const timeBanner = document.querySelector('.time-banner');
  const board = document.getElementById("gameBoard");
  
  // Remueve las clases de animación del banner y del tablero
  if(timeBanner) timeBanner.classList.remove('slide-up');
  if(board) board.classList.remove('slide-left');
  
  // Remueve las clases de animación de gameOverScreen y resultsScreen (si se aplicaron)
  gameOverScreen.classList.remove('slide-in-from-right', 'slide-out-to-left');
  resultsScreen.classList.remove('slide-in-from-right', 'slide-out-to-left');
  
  // Asegúrate de ocultar las pantallas que pudieran estar visibles
  qrScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  resultsScreen.style.display = "none";
  
  // Muestra la pantalla del juego y reinicia el juego
  gameScreen.style.display = "block";
  startGame();
});

