console.log("Let's save some kittens today!");

/*-------------------------------- Constants --------------------------------*/

// Total kittens to find and total time allowed
const totalKittens = 5;
const startingTime = 30;
const gridSize = 5;



/*---------------------------- Variables (State) ----------------------------*/

let level = 1;
let timeLeft = startingTime;
let timerInterval = null;
let introStep = 0;
let isMusicPlaying = false; // default to off
let foundKittens = 0; // to track found kittens
let gameOver = false; // to track game state
let board = []; 

/*------------------------ Cached Element References ------------------------*/

document.addEventListener("DOMContentLoaded", () => {
  const introBox = document.querySelector("#introBox");
  const introText = document.querySelector("#introText");
  const introBtn = document.querySelector("#introNextBtn");

  const introImage = document.querySelector("#introImage");
  const instructionImage = document.querySelector("#instructionImage");
  const warningImage = document.querySelector("#warningImage");

  const timerDisplay = document.querySelector("#timer");
  const grid = document.querySelector("#grid");

  const musicButton = document.querySelector("#musicButton");
  const bgMusic = document.querySelector("#bgMusic");

  const levelDisplay = document.querySelector("#levelDisplay");
  const levelUpMessage = document.querySelector("#level-up-message");
  const levelUpText = document.querySelector("#level-up-text");
  const nextLevelBtn = document.querySelector("#next-level-btn");
  const restartBtn = document.querySelector("#restart");

   //restartBtn = document.querySelector("#restart");

  
/*----------------------------- Functions -----------------------------------*/

  function initializeBoard(gridSize, totalKittens) {
    const tileTypes = Array(totalKittens).fill("kitten").concat(["dog"]);
    const emptyTiles = (gridSize * gridSize) - tileTypes.length;
    tileTypes.push(...Array(emptyTiles).fill("empty"));

    // Shuffle tiles
    for (let i = tileTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tileTypes[i], tileTypes[j]] = [tileTypes[j], tileTypes[i]];
    }

    // Convert to tile objects
    return tileTypes.map(type => ({
      type: type,
      revealed: false
    }));
  };   
  
  function startTimer() {
    timerInterval = setInterval(() => { // interval for countdown
      if (gameOver) return; // Stop the timer if the game is over
      timeLeft--;
      if (timeLeft < 0) {
        playLoseSound();
        endGame(false);
        return;
      }

      timerDisplay.textContent = `⏰Time Left: ${timeLeft}s`;

      if (timeLeft === 0) {
        playLoseSound();
        // Show dog barking message
        const dogBark = document.createElement("div");
        dogBark.textContent = "🐶 Woof! Time's up!";  
        clearInterval(timerInterval); 
        timerDisplay.textContent = "Time's up!";  
        endGame(false);
      }
    }, 1000);
  };

function checkWinCondition() {
  if (foundKittens === totalKittens) {
    clearInterval(timerInterval);
    gameOver = true;
    launchConfetti();
    playWinSound();

    level++;

    if (level <= 3) {
      const messageBox = document.querySelector("#message");
      messageBox.tectContent = `Level ${level - 1} complete! Continue to next level ${level}!`;
      messageBox.classList.remove("hidden");

      setTimeout(() => {
        messageBox.classList.add("hidden");
        resetGame();
      }, 2000); // pause for 2 s
    } else {
      documentQuerySelector("#mesage").textContent = "Congratulations! You rescued all the kittens!";
      gameOver = true;
    }
    bgMusic.pause();
    musicButton.innerText = "🔇";
  }; 
};

  function endGame(won) {
    clearInterval(timerInterval);
    gameOver = true;
    if (!won) {
      levelUpText.textContent = `Level ${level} Complete!`;
      nextLevelBtn.textContent = `Start Level ${level + 1}`;
      levelUpMessage.classList.remove("hidden");
    } else {
      levelUpText.textContent = "Time's up! Game Over!";
      nextLevelBtn.classList.add("hidden");
      levelUpMessage.classList.remove("hidden");
    };

    // Stop music on game end
    bgMusic.pause();
    musicButton.innerText = "🔈";
    isMusicPlaying = false;
  };

  function playLoseSound() {
    const sound = new Audio("./resources/Music/timesup.mp3");
    sound.volume = 0.1;
    sound.play();
  };

  function playWinSound() {
    const sound = new Audio("./resources/Music/winsong.mp3");
    sound.volume = 0.1;
    sound.play();
  };

  function renderBoard() {
    grid.innerHTML = ""; // clear old grid
    board.forEach((tileObj, index) => {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.setAttribute("data-index", index);

      tile.addEventListener("click", () => {
        console.log("Tile clicked");
        if (gameOver || tileObj.revealed) {
          return;
        }

        tileObj.revealed = true;

        if (tileObj.type === "kitten") {
          tile.textContent = "🐱";
          foundKittens++;
          checkWinCondition();
        } else if (tileObj.type === "dog") {
          tile.textContent = "🐶";
          playLoseSound();
          scareAllKittens();
        } else {
          tile.textContent = " ";
        };
      });

      grid.appendChild(tile);
    });
  };

  function resetGame() {
    foundKittens = 0;
    // timeLeft = startingTime;
    gameOver = false;
// get time based on level
    timeLeft = getStartingTime();
    timerDisplay.textContent = `⏰ Time Left: ${timeLeft}s`;

    levelDisplay.textContent = `Level: ${level}`;

    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    board = initializeBoard(gridSize, totalKittens);
    renderBoard();

    if (isMusicPlaying) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.play();
    }

    startTimer();
  };

  function scareAllKittens () {
    foundKittens = 0;

    board.forEach((tileObj, index) => {
      if (tileObj.type === "kitten" && tileObj.revealed) {
        tileObj.revealed = false; // Reset the revealed state

        const tile = document.querySelector(`.tile[data-index="${index}"]`);
        tile.textContent = ""; // Clear the tile content
      }
    });
  };

  function launchConfetti() {
    confetti({
        particleCount: 1000,
        spread: 300,
        origin: { y:0.5 }, // start confetti near the top
    });
}

function getStartingTime() {
  if (level === 1) return 30;
  if (level === 2) return 25;
  if (level === 3) return 20;
  // if (level === 4) return 15; ==== check if possible
}


/*--------------------------- Event Listeners -------------------------------*/
  

  introBtn.addEventListener("click", () => {
    introStep++;

    // Hide all images first
    introImage.classList.add("hidden");
    instructionImage.classList.add("hidden");
    warningImage.classList.add("hidden");

    if (introStep === 1) {
      introText.textContent =
        "Find 5 kittens before time runs out! But, be careful!";
      instructionImage.classList.remove("hidden");
      introBtn.textContent = "Next";
    } else if (introStep === 2) {
      introText.textContent =
        "There is a hidden dog! If you click the dog, all kittens will hide again!";
      warningImage.classList.remove("hidden");
      playLoseSound();
      introBtn.textContent = "Start Game";
    } else if (introStep === 3) {
      introBox.style.display = "none";
      grid.classList.remove("hidden");

      board = initializeBoard(gridSize, totalKittens);
      renderBoard();
      
      startTimer();
    }
  });

  musicButton.addEventListener("click", () => {
    if (!bgMusic) {
      return;
    }
    if (bgMusic.paused) {
      bgMusic.volume = 0.1;
      bgMusic.play();
      musicButton.innerText = "🔈";
      isMusicPlaying = true;
    } else {
      bgMusic.pause();
      musicButton.innerText = "🔇";
      isMusicPlaying = false;
    }
  }); 

  restartBtn.addEventListener("click", () => {
      resetGame();
    });

  nextLevelBtn.addEventListener("click", () => {
    level++;
    levelUpMessage.classList.add("hidden");
    resetGame();  
  })

  restartBtn.addEventListener("click", () => {
    level = 1;
    levelUpMessage.classList.add("hidden");
     resetGame();
  });



});

  