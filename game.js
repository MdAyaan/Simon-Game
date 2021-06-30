var level = 1;
var start = false;
var diff = 1;
var diffId;
var reqDifficulty = false;
var gameTime = 10;
gamePattern = [];
userClickedPattern = [];
buttonColors = ["red", "yellow", "blue", "green"];

$(".difficulty").addClass("invisible");
$(".getDifficulty").addClass("inactive");

function startGame() {
  level++;
  $(".container").addClass("aboveAll");
  $(".start-btn").addClass("invisible");

  setTimeout(function () {
    generateRandomColor(gamePattern);
    console.log(gamePattern);
    userClickedPattern = [];
  }, gameTime * 100);
  idleTime = 0;
}

function addColorIn(pattern, color) {
  $("#" + color).addClass("pressed");
  setTimeout(function () {
    $("#" + color).removeClass("pressed");
  }, 200);
  pattern.push(color);
  playAudio(color);
}

function generateRandomColor(pattern) {
  var idx = Math.floor(Math.random() * 4);
  addColorIn(gamePattern, buttonColors[idx]);
}

function playAudio(color) {
  var file = "sounds/" + color + ".mp3";
  var audio = new Audio(file);
  audio.play();
}

function reset(reason) {
  setTimeout(function () {
    $(".container").removeClass("aboveAll");
    $(".start-btn").removeClass("invisible");
    start = false;
    $("body").addClass("game-over");
    playAudio("wrong");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);
    $("#level-title").html(
      reason +
        "<br>GAME OVER!!<br>" +
        "Your score was " +
        --level +
        "<br>Press any to START AGAIN"
    );
    level = 1;
    userClickedPattern = gamePattern = [];
    reqDifficulty = true;
  }, 500);
  idleTime = 0;
}

function check(idx) {
  if (gamePattern[idx] != userClickedPattern[idx]) return false;
  if (idx == gamePattern.length - 1) startGame();
}

function startFunction() {
  $(".difficulty").removeClass("invisible");
  $("#level-title").addClass("reduceVisibility");
  $(".getDifficulty").removeClass("inactive");
  $(".container").addClass("reduceVisibility");
  start = true;
  reqDifficulty = true;
}

$(".btn").click(function () {
  if (!start || reqDifficulty) return;
  idleTime = 0;

  addColorIn(userClickedPattern, this.id);
  if (check(userClickedPattern.length - 1) == false) {
    reset("Wrong Match");
  }
});

$(document).keypress(function (evt) {
  if (start == false) startFunction();
});

$(".difficulty").click(function () {
  if (!reqDifficulty || !start) return;
  reqDifficulty = false;
  if (this.id == "Easy") (diff = 1), (gameTime = 10);
  else if (this.id == "Medium") (diff = 3), (gameTime = 7);
  else (diff = 5), (gameTime = 5);
  diffId = this.id;
  $(".container").removeClass("reduceVisibility");
  $(".difficulty").addClass("invisible");
  $("#level-title").removeClass("reduceVisibility");
  $(".getDifficulty").addClass("inactive");
  idleTime = 0;
  startGame();
});

var idleTime = 0;
$(document).ready(function () {
  var idleInterval = setInterval(timerIncrement, 1000);
});

function timerIncrement() {
  idleTime = idleTime + 1;
  if (start && !reqDifficulty) {
    $("#level-title").html(
      "Level: " +
        (level - 1) +
        "<br>Difficulty: " +
        diffId +
        "<br>Time left: " +
        (gameTime - idleTime + 1) +
        " seconds"
    );
    if (idleTime > gameTime) reset("Time Out!!");
  }
}
