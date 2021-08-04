var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3;

var score = 0;
var sets,setsImg;
var gameOver, restart;

var dieSound, jumpSound, checkSound;
var floor,floorImg;
var setsGroup;
function preload() {
  trex_running = loadAnimation("trex1.png", "trex2.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkSound = loadSound("checkpoint.mp3");

  floorImg=loadImage("ground1.png");
setsImg=loadImage("background.png");
}

function setup() {
  createCanvas(600,300);
  console.log(windowWidth);
  console.log(windowHeight);
  trex = createSprite(50, height - 50, 20, 50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.9;
  trex.setCollider("circle", 20, 0, 10);
  //trex.debug=true;

  ground = createSprite(width / 2, height - 85, width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + (3 * score) / 100);

  gameOver = createSprite(width / 2, height / 2 + 30);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(width / 2, height - 90, width, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  setsGroup = new Group();
  floor = createSprite(width / 2, height - 100, width, 20);
  floor.addImage("ground", floorImg);
  floor.x = ground.width / 2;
  floor.velocityX = -(6 + (3 * score) / 100);

  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("score: " + score, 50, height - 200);
  textSize(90);
  if (gameState === PLAY) {
    score = score + Math.round(frameCount / 60);
    ground.velocityX = -6;
floor.velocityX=-6;
    if ((keyDown("space") || touches.length > 0) && trex.isTouching(ground)) {
      trex.velocityY = 8;
      jumpSound.play();
      touches = [];
    }

    trex.velocityY = trex.velocityY - 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (floor.x < 0) {
      floor.x = floor.width / 2;
    }
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnsets();
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    floor.velocityX=0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
   setsGroup.setVelocityXEach(0);
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
setsGroup.setLifetimeEach(-1);
    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width, height - 60, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -6;

    //assign lifetime to the variable
    cloud.lifetime = width / cloud.velocityX;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width, height - 80, 10, 40);
    //obstacle.debug = true;
    obstacle.velocityX = -6;

    //generate random obstacles
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
setsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);

  score = 0;
}

function spawnsets() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     sets = createSprite(width, height - 123, 40, 10);
    sets.addImage(setsImg);
    //sets.scale = 0.5;
    sets.velocityX = -6;

    //assign lifetime to the variable
    sets.lifetime = width / sets.velocityX;

    //adjust the depth
    sets.depth = trex.depth;
    setsGroup.add(sets);
  }
}