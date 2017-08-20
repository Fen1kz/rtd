import React from 'react';
import ClientGame from './ClientGame';

export default class ReactGame extends React.PureComponent {
  gameMounted = (c) => {
    console.log(this.node, this.game);
    if (!!c) this.node = c;
    if (!this.game) {
      this.game = new ClientGame();
      const view = this.game.createRenderer();
      this.node.appendChild(view);
      this.game.start();
    }
  };

  render() {
    console.log('GAME RENDER');
    return (<div>
      <div id="game" ref={this.gameMounted}/>
      <div>
        <button onClick={() => this.game.spawn()}>spawn</button>
      </div>
    </div>);
  }
}