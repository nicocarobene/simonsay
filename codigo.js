const round = document.getElementById("round");
const simonButtons= document.querySelectorAll(".square");
const startButton = document.getElementById("startButton");



class Simon{
  constructor(simonButtons,startButton, round){
    //simonButtons van a ser los botones de simon
    //startButton sera el button de start de nuestro html
    //round sera nuestro round de html
    this.round = 0;
    this.userPosition = 0;//numero de array indicando en que momento de la secuencia se encuentra clickeo dos veces se encuentra en la secuencia 2 para 3°
    this.totalRounds= 10;
    this.sequence = [];
    this.speed = 1000;
    this.blockedButtons= true;
    this.buttons = Array.from(simonButtons);//simonButtons va a contener nuestras constante de botones en simon osea 4
    this.display = {
      startButton,
      round
    }
    this.errorSound= new Audio ("./sounds/error.wav");
    this.buttonSounds=[
      new Audio("./sounds/1.mp3"),
      new Audio("./sounds/2.mp3"),
      new Audio("./sounds/3.mp3"),
      new Audio("./sounds/4.mp3"),
    ];
    
  }
  //Iniciar el Simon
  //esto simularia al switch de los juegues on/off

  init(){
    this.display.startButton.onclick=()=>{this.startGame()}
  }

  //Comienzo del Juego
  startGame(){
    this.display.startButton.disabled = true;
    this.updateRound(0);
    this.userPosition = 0;
    this.sequence= this.createSequence();
    this.buttons.forEach((element,i)=>{
      element.classList.remove("winner");
      element.onclick = ()=> this.buttonClick(i)
    });
    this.showSequence();
  }

  //Actualizar la ronda y tablero
  //va alcualizando en round el numero indicandonos en que ronda vamos.
  updateRound(value){
    this.round= value;
    this.display.round.textContent = `Round ${this.round}`;
  }

  //Crear el array aleatorio de botones
  createSequence(){
    return Array.from({length:this.totalRounds},()=>this.getRandomColor())
  }

  //devuelve un numero al azar entre 0 y 3
  getRandomColor(){
    return Math.floor(Math.random()*4);
  }

  //Ejecutar una funcion cuando se hace click en un botón
  buttonClick(value){
    !this.blockedButtons && this.validateChosenColor(value);
  }

  //validar si el boton que toca usuario corresponde al valor de la secuencia
  validateChosenColor(value){
    if(this.sequence[this.userPosition]=== value){
      this.buttonSounds[value].play();
      if(this.round === this.userPosition){
//esto es para comparar si la secuencia en la que va el usuario es igula a la ronda, osea si vamos por la ronda 2 el usuario tiene que clickear 2 boton de la secuencia a medida que va clickeando arranca el else con user position ++
        this.updateRound(this.round + 1);
        this.speed /= 1.02;
        this.isGameOver();
      }else{
        this.userPosition++;
      }
    }else{
      this.gameLost();
    }
  }

    // Verifica que no haya acabado el juego
    isGameOver(){
      if(this.round === this.totalRounds){
        this.gameWon();
      }else{
//esto indica que si va por la ronda tres y user position dio correctamente la posicion, setiamos user position a 0 para que vuelva a iniciar la secuencia que tiene que realizar usuario y showSecuencia recuerda al usuario la secuencia hasta la ronda que va con el nuevo valor a clickear
        this.userPosition=0;
        this.showSequence();
      }
    }

    //muestra la secuencia de botones que va a tener que tocar el usuario
    showSequence(){
      this.blockedButtons=true;
      let sequenceIndex = 0;
      let timer = setInterval(()=>{
        const button= this.buttons[this.sequence[sequenceIndex]];
        this.buttonSounds[this.sequence[sequenceIndex]].play();
        this.toggleButtonStyle(button)
        setTimeout(()=> this.toggleButtonStyle(button),this.speed/2)
        sequenceIndex++;
        if (sequenceIndex > this.round){
//con esto chequeamos hasta donde mostrar y paramos
          this.blockedButtons = false;
          clearInterval(timer);
        }
      },this.speed)
    }

    //Pinta los botones para cuendo se estan mostrando la secuencia 
    toggleButtonStyle(button){
      button.classList.toggle("active");
    }

    //Actualiza el simon cuando el juegador pierde

    gameLost(){
      this.errorSound.play();
      this.display.startButton.disabled= false;
      this.blockedButtons=true;
    }

    //muestra la animacion de triunfo y actualiza el simon cuado el jugador gana
    gameWon(){
      this.display.startButton.disabled=false;
      this.blockedButtons=true;
      this.buttons.forEach(element=>{
        element.classList.add("winner");
      });
      this.updateRound("🏆");
    }
}


const simon = new Simon (simonButtons, startButton, round)
simon.init();