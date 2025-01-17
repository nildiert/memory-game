// ---------------------
// Variables globales
// ---------------------
const gameBoard = document.getElementById("gameBoard");
const timerElement = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const endGameModal = document.getElementById("endGameModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const finalTimeElement = document.getElementById("finalTime");
const playerNameInput = document.getElementById("playerName");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const scoreList = document.getElementById("scoreList");

let cards = [];
let flippedCards = [];
let matchedCount = 0;
let timer;
let totalSeconds = 0;
let isGameActive = false;

// ---------------------
// Función para generar el array con módulos duplicados
// ---------------------
function generateCardsArray() {
  // Módulos: 1 a 12
  const modules = [];
  for (let i = 1; i <= 12; i++) {
    modules.push(`Módulo ${i}`);
  }
  // Duplicar el array
  const duplicatedModules = [...modules, ...modules];
  // Mezclar el array
  return shuffleArray(duplicatedModules);
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
  // Limpiamos el tablero
  gameBoard.innerHTML = "";
  matchedCount = 0;
  flippedCards = [];

  // Generar array mezclado de "Módulo X"
  const cardValues = generateCardsArray();

  // Crear elementos de carta
  cardValues.forEach((value) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    // Lado trasero (oculto)
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.textContent = "😊";

    // Lado frontal (revelado)
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.textContent = value;

    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    cardElement.appendChild(cardInner);

    // Añadir evento de click
    cardElement.addEventListener("click", () => flipCard(cardElement, value));

    // Agregar al gameBoard
    gameBoard.appendChild(cardElement);
  });
}

// ---------------------
// Manejo del flip de la carta
// ---------------------
function flipCard(cardElement, value) {
  // Si la carta ya está volteada o si hay dos cartas volteadas, no hacer nada
  if (cardElement.classList.contains("flipped") || flippedCards.length === 2) {
    return;
  }

  cardElement.classList.add("flipped");
  flippedCards.push({ cardElement, value });

  // Revisar si hay dos cartas volteadas
  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

// ---------------------
// Verificar si las cartas coinciden
// ---------------------
function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.value === card2.value) {
    // Coincidencia
    matchedCount += 2;
    flippedCards = [];

    // Verificar si el juego ha terminado
    if (matchedCount === 24) {
      endGame();
    }
  } else {
    // No coinciden, voltearlas de nuevo
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
// Manejo del tiempo
// ---------------------
function startTimer() {
  // Reiniciar si ya estaba activo
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
  const formattedTime = 
    `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  timerElement.textContent = `Tiempo: ${formattedTime}`;
}

// ---------------------
// Terminar el juego
// ---------------------
function endGame() {
  clearInterval(timer);
  isGameActive = false;

  // Mostrar el modal
  endGameModal.style.display = "block";
  finalTimeElement.textContent = totalSeconds;
}

// ---------------------
// Cerrar modal
// ---------------------
closeModalBtn.addEventListener("click", () => {
  endGameModal.style.display = "none";
});

// ---------------------
// Guardar puntuación
// ---------------------
saveScoreBtn.addEventListener("click", saveScore);

function saveScore() {
  const playerName = playerNameInput.value.trim();
  if (!playerName) return;
  
  // Guardamos en el localStorage (o en memoria) para la tabla
  const scoreData = {
    name: playerName,
    time: totalSeconds
  };

  // Obtener la lista de scores guardada
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(scoreData);

  // Ordenar de menor a mayor tiempo (mejor tiempo primero)
  scores.sort((a, b) => a.time - b.time);

  // Guardar en localStorage
  localStorage.setItem("scores", JSON.stringify(scores));

  // Actualizar la tabla
  updateScoreboard();

  // Limpiar campo nombre
  playerNameInput.value = "";
  endGameModal.style.display = "none";
}

// ---------------------
// Mostrar tabla de posiciones
// ---------------------
function updateScoreboard() {
  scoreList.innerHTML = "";
  const scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.forEach((score) => {
    const li = document.createElement("li");
    li.textContent = `${score.name} - ${score.time} segundos`;
    scoreList.appendChild(li);
  });
}

// ---------------------
// Botón de reiniciar
// ---------------------
restartBtn.addEventListener("click", () => {
  // Ocultar modal si estaba abierto
  endGameModal.style.display = "none";
  startGame();
});

// ---------------------
// Al cargar la página
// ---------------------
window.addEventListener("DOMContentLoaded", () => {
  updateScoreboard();
  startGame();
});
