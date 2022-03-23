var canvas;
var backgroundImage;
var bgImg;
var database, gameState;
var form, player;
var playerCount;
var fuels, coins, obstacles;
var coinsImage, fuelImage, lifeImage;
var obstacle1Image, obstacle2Image;
var allPlayers, car1, car2, car1_img, car2_img, track;
var cars = [];

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  coinsImage = loadImage("assets/goldCoin.png");
  fuelImage = loadImage("assets/fuel.png");
  obstacle1Image = loadImage("assets/obstacle1.png");
  obstacle2Image = loadImage("assets/obstacle2.png");
  lifeImage = loadImage("./assets/life.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
 database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);

 if (playerCount===2) {
   game.update(1);
 }

 if (gameState === 1) {
   game.play();
 }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
