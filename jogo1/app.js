function start() {
  $("#start").hide();
  $("#background").append("<div id='player' class='player-animation'></div>");
  $("#background").append("<div id='enemy1' class='enemy-animation'></div>");
  $("#background").append("<div id='enemy2'></div>");
  $("#background").append(
    "<div id='companion' class='companion-animation'></div>"
  );
  $("#background").append("<div id='score'></div>");
  $("#background").append("<div id='health'></div>");
  var somDisparo = document.getElementById("somDisparo");
  var somExplosao = document.getElementById("somExplosao");
  var music = document.getElementById("musica");
  var somGameover = document.getElementById("somGameover");
  var somPerdido = document.getElementById("somPerdido");
  var somRescue = document.getElementById("somRescue");
  music.addEventListener("ended", function () { musica.currentTime = 0; music.play(); }, false);
  music.play();

  let game = {};
  game.timer = setInterval(loop, 30);

  let key = {
    W: 87,
    S: 83,
    D: 68,
  };

  game.pressed = [];

  let speed = 5;
  let yPosition = parseInt(Math.random() * 334);

  let canShoot = true;
  let gameOver = false;
  var points = 0;
  var saved = 0;
  var lost = 0;
  var currentHealth = 3;

  $(document).keydown(function (e) {
    game.pressed[e.which] = true;
  });

  $(document).keyup(function (e) {
    game.pressed[e.which] = false;
  });

  function loop() {
    moveBackground();
    movePlayer();
    moveEnemy1();
    moveEnemy2();
    moveCompanion();
    shot();
    collision();
    score();
    health();

  }

  function moveBackground() {
    left = parseInt($("#background").css("background-position"));
    $("#background").css("background-position", left - 1);
  }

  function movePlayer() {
    if (game.pressed[key.W]) {
      let top = parseInt($("#player").css("top"));
      $("#player").css("top", top - 10);

      if (top <= 0) {
        $("#player").css("top", top + 10);
      }
    }

    if (game.pressed[key.S]) {
      let top = parseInt($("#player").css("top"));
      $("#player").css("top", top + 10);

      if (top >= 434) {
        $("#player").css("top", top - 10);
      }
    }

    if (game.pressed[key.D]) {
      shot();
    }
  }

  function moveEnemy1() {
    xPosition = parseInt($("#enemy1").css("left"));
    $("#enemy1").css("left", xPosition - speed);
    $("#enemy1").css("top", yPosition);

    if (xPosition <= 0) {
      yPosition = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 694);
      $("#enemy1").css("top", yPosition);
    }
  }

  function moveEnemy2() {
    xPosition = parseInt($("#enemy2").css("left"));
    $("#enemy2").css("left", xPosition - 3);

    if (xPosition <= 0) {
      $("#enemy2").css("left", 775);
    }
  }

  function moveCompanion() {
    xPosition = parseInt($("#companion").css("left"));
    $("#companion").css("left", xPosition + 1);

    if (xPosition > 906) {
      $("#companion").css("left", 0);
    }
  }

  function shot() {
    if (canShoot == true) {
      somDisparo.play();
      canShoot = false;
      top = parseInt($("#player").css("top"));
      xPosition = parseInt($("#player").css("left"));
      xShot = xPosition + 190;
      topShot = top + 37;
      $("#background").append("<div id='shoot'></div");
      $("#shoot").css("top", topShot);
      $("#shoot").css("left", xShot);

      var shootTime = window.setInterval(shoot, 30);
    }

    function shoot() {
      xPosition = parseInt($("#shoot").css("left"));
      $("#shoot").css("left", xPosition + 15);

      if (xPosition > 900) {
        window.clearInterval(shootTime);
        shootTime = null;
        $("#shoot").remove();
        canShoot = true;
      }
    }
  }

  function collision() {
    var collision1 = $("#player").collision($("#enemy1"));
    var collision2 = ($("#player").collision($("#enemy2")));
    var collision3 = ($("#shoot").collision($("#enemy1")));
    var collision4 = ($("#shoot").collision($("#enemy2")));
    var collision5 = ($("#player").collision($("#companion")));
    var collision6 = ($("#enemy2").collision($("#companion")));

    if (collision1.length > 0) {
      currentHealth--;
      enemy1XPosition = parseInt($("#enemy1").css("left"));
      enemy1YPosition = parseInt($("#enemy1").css("top"));
      explosion1(enemy1XPosition, enemy1YPosition);

      YPosition = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 694);
      $("#enemy1").css("top", YPosition);
    }

    if (collision2.length > 0) {
      currentHealth--;
      enemy2XPosition = parseInt($("#enemy2").css("left"));
      enemy2YPosition = parseInt($("#enemy2").css("top"));
      explosion2(enemy2XPosition, enemy2YPosition);
      $("#enemy2").remove();

      respawnEnemy2();
    }

    if (collision3.length > 0) {
      speed = speed + 0.3;

      points = points + 100;
      enemy1X = parseInt($("#enemy1").css("left"));
      enemy1Y = parseInt($("#enemy1").css("top"));

      explosion1(enemy1X, enemy1Y);
      $("#disparo").css("left", 950);

      yPosition = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 694);
      $("#enemy1").css("top", yPosition);
    }

    if (collision4.length > 0) {
      points = points + 50;
      enemy2X = parseInt($("#enemy2").css("left"));
      enemy2Y = parseInt($("#enemy2").css("top"));
      $("#enemy2").remove();
      explosion2(enemy2X, enemy2Y);
      $("#disparo").css("left", 950);
      respawnEnemy2();
    }

    if (collision5.length > 0) {
      saved++;
      somRescue.play();
      respawnCompanion();
      $("#companion").remove();
    }

    if (collision6.length > 0) {
      lost++;
      somPerdido.play();
      companionX = parseInt($("#companion").css("left"));
      companionY = parseInt($("#companion").css("top"));
      explosion3(companionX, companionY);
      $("#companion").remove();

      respawnCompanion();
    }
  }

  function explosion1(enemy1XPosition, enemy1YPosition) {
    somExplosao.play();
    $("#background").append("<div id='explosion1'></div");
    $("#explosion1").css("background-image", "url('./imgs/explosao.png')");
    let div = $("#explosion1");
    div.css("top", enemy1YPosition);
    div.css("left", enemy1XPosition);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var explosionTime = window.setInterval(removeExplosion, 1000);

    function removeExplosion() {
      div.remove();
      window.clearInterval(explosionTime);
      explosionTime = null;
    }
  }

  function explosion2(enemy2X, enemy2Y) {
    somExplosao.play();
    $("#background").append("<div id='explosion2'></div");
    $("#explosion2").css("background-image", "url(imgs/explosao.png)");
    var div2 = $("#explosion2");
    div2.css("top", enemy2Y);
    div2.css("left", enemy2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");

    var explosion2Time = window.setInterval(removeExplosion2, 1000);

    function removeExplosion2() {
      div2.remove();
      window.clearInterval(explosion2Time);
      explosion2Time = null;
    }
  }

  function explosion3(companionX, companionY) {
    $("#background").append("<div id='explosion3' class='anima4'></div");
    $("#explosion3").css("top", companionY);
    $("#explosion3").css("left", companionX);

    var explosion3Time = window.setInterval(resetExplosion3, 1000);

    function resetExplosion3() {
      $("#explosion3").remove();
      window.clearInterval(explosion3Time);
      explosion3Time = null;
    }
  }

  function respawnEnemy2() {
    var collision4Time = window.setInterval(reposition4, 5000);

    function reposition4() {
      window.clearInterval(collision4Time);
      collision4Time = null;

      if (gameOver == false) {
        $("#background").append("<div id=enemy2></div");
      }
    }
  }

  function respawnCompanion() {
    var companionTime = window.setInterval(reposition6, 5000);

    function reposition6() {
      window.clearInterval(companionTime);
      companionTime = null;

      if (gameOver == false) {
        $("#background").append("<div id='companion' class='companion-animation'></div>");
      }
    }
  }

  function score() {
    $("#score").html("<h2> Points: " + points + " Saved: " + saved + " Lost: " + lost + "</h2>");
  }

  function health() {
    if (currentHealth == 3) {
      $("#health").css("background-image", "url('./imgs/energia3.png')");
    }

    if (currentHealth == 2) {
      $("#health").css("background-image", "url('./imgs/energia2.png')");
    }

    if (currentHealth == 1) {
      $("#health").css("background-image", "url('./imgs/energia1.png')");
    }

    if (currentHealth == 0) {
      $("#health").css("background-image", "url('./imgs/energia0.png')");
      endGame();
    }
  }

  function endGame() {
    gameOver = true;
    musica.pause();
    somGameover.play();
    window.clearInterval(game.timer);
    game.timer = null;

    $("#player").remove();
    $("#enemy1").remove();
    $("#enemy2").remove();
    $("#companion").remove();
    $("#background").append("<div id='end'></div>");
    $("#end").html("<h1>Game Over</h1><p>Your score was: " + points + "</p>" + "<div id='restart' onclick='restartGame()'><h3>Play Again</h3></div>");
  }
}

function restartGame() {
  somGameover.pause();
  $("#end").remove();
  start();
}
