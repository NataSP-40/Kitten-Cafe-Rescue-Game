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
let restartBtn = null; 

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

  const restartBtn = document.querySelector("#restart");
  
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

//================win condition
function checkWinCondition() {
  if (foundKittens === totalKittens) {
    console.log(`Found Kittens: ${foundKittens} out of ${totalKittens
    }`);
    clearInterval(timerInterval);
    gameOver = true;
    launchConfetti();
    playWinSound();
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

  function playWinSound() {
    const sound = new Audio("../resourses/Music/winsong.mp3");
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
// clear any existing timer before starting a new one
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    board = initializeBoard(gridSize, totalKittens);
    renderBoard();

    startTimer(); // now start the timer again

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

  function launchConfetti() {
    confetti({
        particleCount: 1000,
        spread: 300,
        origin: { y:0.5 }, // start confetti near the top
    });
}


/*--------------------------- Event Listeners -------------------------------*/
  

  introBtn.addEventListener("click", () => {
    console.log("Intro button clicked");
    introStep++;
    console.log("New introStep:", introStep);

    // Hide all images first
    introImage.classList.add("hidden");
    instructionImage.classList.add("hidden");
    warningImage.classList.add("hidden");

    if (introStep === 1) {
      console.log("Intro step 1");
      introText.textContent =
        "Here is what you need to do: Find all 5 kittens before time runs out and the dog comes! But, be careful!";
      instructionImage.classList.remove("hidden");
      introBtn.textContent = "Next";
    } else if (introStep === 2) {
      console.log("Intro step 2");
      introText.textContent =
        "There is a hidden dog! 🐾 If you click the dog, all kittens will hide again!";
      warningImage.classList.remove("hidden");
      introBtn.textContent = "Start Game";
    } else if (introStep === 3) {
      console.log("Intro step 3");
      introBox.style.display = "none";
      grid.classList.remove("hidden");

      board = initializeBoard(gridSize, totalKittens);
      renderBoard();
      
      startTimer();
    }
  });

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
  }); 

  restartBtn.addEventListener("click", () => {
    // if (gameOver) { 
      // restartBtn not working if game is not over
    // check renderBoard or introStep 
      resetGame();
      
    };
  });

});
  