console.log("Let's save some kittens today!");

/*-------------------------------- Constants --------------------------------*/

// Total kittens to find and total time allowed
const totalKittens = 5;
const startingTime = 20;
const gridSize = 5;



/*---------------------------- Variables (State) ----------------------------*/

let timeLeft = startingTime;
let timerInterval = null;
let introStep = 0;
let isMusicPlaying = false; // default to off
let foundKittens = 0; // to track found kittens
let gameOver = false;
let board = []; 
let resartBtn = null; 

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

  // add html elements for the game board

  const tiles = document.querySelectorAll(".tile");

  const restartBtn = document.querySelector("#restart");
  

/*----------------------------- Functions -----------------------------------*/
 // randomize the board = need fixing
 // Create a shuffled board with kittens, dog, and empty spaces
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

      timerDisplay.textContent = `Time Left: ${timeLeft}s`;

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
// --- start Game Function ----
//================win condition
function checkWinCondition() {
  if (foundKittens === totalKittens) {
    console.log(`Found Kittens: ${foundKittens} out of ${totalKittens
    }`);
    clearInterval(timerInterval);
    gameOver = true;
    alert("Congratulations! You found all the kittens!");
    bgMusic.pause();
    musicButton.innerText = "🔇";
  }; 
};
//================= end game
  function endGame(won) {
    clearInterval(timerInterval);
    if (!won) {
      console.log("Dog barking");
    }

    // Stop music on game end
    bgMusic.pause();
    musicButton.innerText = "🔈";
    isMusicPlaying = false;
  };
//=======play sound when lose
  function playLoseSound() {
    const sound = new Audio("../resourses/Music/timesup.mp3");
    sound.play();
  };

  function renderBoard() {
    grid.innerHTML = ""; // clear old grid
    board.forEach((tileObj, index) => {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.setAttribute("data-index", index);

      tile.addEventListener("click", () => {
        if (gameOver || tileObj.revealed) return;

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
    timeLeft = startingTime;
    gameOver = false;

    clearInterval(timerInterval);

    board = initializeBoard(gridSize, totalKittens);
    renderBoard();

    startTimer();

    if (isMusicPlaying) {
      bgMusic.currentTime = 0;
      bgMusic.play();
    }

    timerDisplay.testContent = `Time Left: ${timeLeft}s`;
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







/*--------------------------- Event Listeners -------------------------------*/
  
  tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => {
        const tileType = board[index];

        // if not allowing clicking the same tile twice will write
        // if (tile.classList.contains("clicked")) return;
        // tile.classList.add("clicked");

        if (tileType === "kitten") {
            tile.textContent = "🐱"
            rescuedKittens++;
            if (rescuedKittens === totalKittens) {
                endGame(true);
            }
        } else if (tileType === "dog") {
            playLoseSound();
            tile.textContent = "🐶";
            endGame(false);
        } else {
            tile.textContent = " ";
        }
      })
    }); 
  // 🔁 Intro sequence logic
  introBtn.addEventListener("click", () => {
    introStep++;

    // Hide all images first
    introImage.classList.add("hidden");
    instructionImage.classList.add("hidden");
    warningImage.classList.add("hidden");

    if (introStep === 1) {
      introText.textContent =
        "Here is what you need to do: Find all 5 kittens before time runs out and the dog comes! But, be careful!";
      instructionImage.classList.remove("hidden");
      introBtn.textContent = "Next";
    } else if (introStep === 2) {
      introText.textContent =
        "There is a hidden dog! 🐾 If you click the dog, all kittens will hide again!";
      warningImage.classList.remove("hidden");
      introBtn.textContent = "Start Game";
    } else if (introStep === 3) {
      introBox.style.display = "none";
      grid.classList.remove("hidden");

      board = initializeBoard(gridSize, totalKittens);
      renderBoard();
      
      startTimer();
      // TODO: startGame() can be added here
    }
  });

  // 🎵 Music toggle logic
  musicButton.addEventListener("click", () => {
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
  }); // bgMusic stops at win/loose

  // Restart button logic
  restartBtn.addEventListener("click", () => {
    if (gameOver) {
      resetGame();
      
    };
    resetGame();
  });




});
  