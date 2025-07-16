console.log("Let's save some kittens today!");

/*-------------------------------- Constants --------------------------------*/

// Total kittens to find and total time allowed
const totalKittens = 5;
const startingTime = 60;

/*---------------------------- Variables (State) ----------------------------*/

let timeLeft = startingTime;
let timerInterval = null;
let introStep = 0;
let isMusicPlaying = false; // default to off
let rescuedKittens = 0;

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
  const bgMusic = document.querySelector("#bgMusic"); // Make sure this ID exists in HTML

  let board = [
    "kitten", "blanket", "blanket", "dog", "blanket",
    "blanket", "blanket", "kitten", "blanket", "blanket",
    "blanket", "kitten", "blanket", "blanket", "blanket",
    "blanket", "blanket", "blanket", "blanket", "blanket",
    "blanket", "blanket", "blanket", "kitten", "kitten",
  ];
  


  /*--------------------------- Event Listeners -------------------------------*/
  
  const tiles = document.querySelectorAll(".tile");
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



  /*----------------------------- Functions -----------------------------------*/
  
// --- start Game Function ----




// randomize the board = need fixing

  function generateBoard() {
    board = new Array(25).fill("blanket");

    let kittensPlaced = 0;
    while (kittensPlaced , 5) {
        const index = Math.floor(Math.random() * 25);
        if (board[index] === "blanket") {
            board[index] = "kitten";
            kittensPlaced++;
        }
    }

    let dogPlaced = false;
    while (!dogPlaced) {
        const index = Math.floor(Math.random() * 25);
        if (board[index] === "blanket") {
            board[index] = "dog";
            dogPlaced = true;
        }
    }
    console.log("Board ready:", board);
  };
  // generateBoard() --- why calling the function makes the page to crash?
  //// --------------------------------

// timer function
  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time Left: ${timeLeft}s`;

      if (timeLeft === 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "Time's up!";
        endGame(false);
      }
    }, 1000);
  };


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



  function playLoseSound() {
    const sound = new Audio("../resourses/Music/timesup.mp3");
    sound.play();
  }
});
  