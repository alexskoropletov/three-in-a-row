let game;
let gameOptions = {
  gemSize: 100,
  swapSpeed: 200,
  fallSpeed: 120,
  destroySpeed: 200,
  boardOffset: {
    x: 100,
    y: 50
  },
  fieldOptions: {
    rows: 7,
    columns: 5,
    items: 7
  }
};

window.onload = function () {
  let gameConfig = {
    width: 700,
    height: 1000,
    scene: playGame,
    // backgroundColor: 0x222222
    backgroundColor: 0x999999
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
  resize();
  window.addEventListener("resize", resize, false);
};

function resize() {
  const canvas = document.querySelector("canvas");
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}
