const SERVER_FPS = 1;

const SERVER_TIMEOUT = 1e3 / SERVER_FPS;

export default class Game {
  constructor() {
    this.lastTickTime = Date.now();
    this.gameTick = this.gameTick.bind(this);
  }

  start() {
    this.players = {};
    this.state = {players: {}};
    console.log(`Game started!`);
    this.gameTick();
  }

  stop() {
  }

  join(player) {
    console.log(`Player joined!`, player.socket.id);
    player.id = player.socket.id;
    player.input = [];
    this.players[player.id] = player;
    player.socket.on('move', (dir) => {
      this.players[player.id].input.push(dir);
    });
  }

  leave(socketId) {
    delete this.players[socketId];
    delete this.state.players[socketId];
  }

  gameTick() {
    let startTickTime = Date.now();
    let deltaTime = startTickTime - this.lastTickTime;
    this.update(timeDelta);
    let endTickTime = Date.now();
    this.lastTickTime = endTickTime;
    let tickTime = endTickTime - startTickTime;
    let waitTime = SERVER_TIMEOUT - tickTime;
    if (waitTime > 0) {
      this.timer = setTimeout(this.gameTick, waitTime);
    } else {
      setImmediate(this.gameTick);
    }
  }

  update(dt) {
    // console.log('update 0', dt);
    // console.log(`players: `, Object.keys(this.players));
    Object.keys(this.players)
      .forEach(pid => {
        if (!this.state.players[pid]) this.state.players[pid] = {id: pid, x: 0, y: 0};
        const player = this.players[pid];
        const statePlayer = this.state.players[pid];
        player.input.forEach((direction) => {
          if (direction === 'right') {
            statePlayer.x += 5;
          } else if (direction === 'left') {
            statePlayer.x -= 5;
          } else if (direction === 'up') {
            statePlayer.y -= 5;
          } else if (direction === 'down') {
            statePlayer.y += 5;
          }
        });
        player.input = [];
        this.state.players[pid] = statePlayer;
      });

    Object.keys(this.players)
      .forEach(pid => {
        const player = this.players[pid];
        player.socket.emit('gameState', this.state);
      })

  }
}