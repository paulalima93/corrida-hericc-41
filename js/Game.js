class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  //recupera o gameState do jogo
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
    gameState = data.val();
    });
  }

  //adiciona as sprites de moedas, combustiveis e obstaculos ao jogo
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {

    //faz um loop para adicionar as imagens de acordo com o numero de sprites escolhido na chamada da função
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //verifica se dentro do array positions tem algum elemento. Se sim, pega as informaçãoes do elemento para x e y. Senão, põe em posições aleatorias
      if (positions.length>0) {
        x = positions[i].x;
        y = positions[i].y;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  //função chamada quando inicia o jogo
  start() {
    form = new Form();
    form.display();

    player = new Player();
    playerCount = player.getCount();

    car1 = createSprite(width/2 -50, height -100 );
    car1.addImage("car1", car1_img);
    car1.scale = 0.1;

    car2 = createSprite(width/2 +100, height -100 );
    car2.addImage("car2", car2_img);
    car2.scale = 0.1;

    cars = [car1, car2];

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();

    //vetor de posições e imagens para os obstaculos
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];


    //adiciona os combustiveis
    this.addSprites(fuels, 4, fuelImage, 0.02);
    //adiciona as moedas
    this.addSprites(coins, 15, coinsImage, 0.07);
    //adiciona os obstaculos baseado no vetor de posições
    this.addSprites(obstacles,obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions)
  }

  update(state){
    database.ref("/").update({
      gameState: state
    })
  }

  //lida com os elementos DOM do jogo
  handleElements(){
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reiniciar Jogo")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2 + 200, 40);
    
    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 +230, 100);

    this.leaderBoardTitle.html("Placar")
    this.leaderBoardTitle.class("resetText")
    this.leaderBoardTitle.position(width/3 -60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width/3 -50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3 -50, 130);
  }

  //metodo exibe o placar de posição e de pontos ganhos ao coletar moedas
  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);

        //se o rank do player1 for igual a 0 e o rank do player2 for igual a 0 E se o rank do player1 for igual a 1
        //esse if verifica se os dois players tem o rank 0, ou seja, ninguem ganhou E se o player1 ganhou.
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    //esse if verifica se o player2 ganhou
    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }



  //metodo que é responsável por manter o estado de jogo quando está em play
  play(){
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if(allPlayers !== undefined){
      image(track, 0, -height*5, width, height*6)

      this.showFuelBar();
      this.showLife();
      this.showLeaderboard();

      var index = 0
      for (var plr in allPlayers){
        index = index +1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index-1].position.x = x;
        cars[index-1].position.y = y;

        if(index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,80,80);


          this.handleFuel(index);
          this.handlePowerCoins(index);

         //camera.position.x = cars[index-1].position.x; 
         camera.position.y = cars[index-1].position.y; 
        }
      }

      this.handlePlayerControls();

       // ---------------->41
      //Linha de chegada
      const finshLine = height * 6 - 200;

      if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  handleResetButton(){
    this.resetButton.mousePressed(()=> {
      database.ref("/").set({
        carsAtEnd: 0,
        playerCount:0,
        gameState:0,
        players: {}
      });
     window.location.reload();
    });
     
  }


  handlePlayerControls(){
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 2 - 200) {
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }
  }
 

  // ---------------->

  //exibe a barra de vida 
  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
    noStroke();
    pop();
  }

  //exibe a barra de combustivel
  showFuelBar() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
    noStroke();
    pop();
  }

  //metodo verifica se o carro e combustivel estão sobrepostos, 
  //se sim, remove o sprite do combustivel e enche o tanque de volta
  handleFuel(index) {
    //adicionando combustível
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      //o sprite é coletado no grupo de colecionáveis que desencadeou o evento
      collected.remove();
    });
  }

  //metodo verifica se o carro e moedas estão sobrepostos, 
  //se sim, remove o sprite do combustivel e enche o tanque de volta
  handlePowerCoins(index) {
    cars[index - 1].overlap(coins, function(collector, collected) {
      player.score += 21;
      player.update();
      //o sprite é coletado no grupo de colecionáveis que desencadeou o evento
      collected.remove();
    });
  }

  
  showRank() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }


}
