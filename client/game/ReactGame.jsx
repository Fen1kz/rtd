import React from 'react';
import ClientGame from './ClientGame';

import {TOOL} from './managers/UIManager';

export default class ReactGame extends React.Component {
  constructor() {
    super();
    this.state = {tool: TOOL.SELECT.id};
  }

  gameMounted = (c) => {
    if (!!c) this.node = c;
    if (!this.game) this.createGame();
  };

  createGame() {
    this.game = new ClientGame();
    const view = this.game.createRenderer();
    this.node.appendChild(view);
    this.game.start();
    this.game.ui.on('change', (state) => this.setState(state));
  }

  componentDidUpdate() {
    if (!(this.game instanceof ClientGame) && !!this.node) {
      this.node.removeChild(this.node.firstNode);
      this.createGame();
    }
  }

  render() {
    return (<div>
      <div id="game" ref={this.gameMounted}/>
      <div>
        <button onClick={() => this.game.ui.emit('SPAWN')}>spawn</button>
        <span style={{background: this.state.tool === TOOL.SELECT.id ? 'red' : 'transparent'}}>S</span>
        <span style={{background: this.state.tool === TOOL.PAINT.id ? 'red' : 'transparent'}}>P</span>
        <span style={{background: this.state.tool === TOOL.SET_BASE.id ? 'red' : 'transparent'}}>B</span>
      </div>
    </div>);
  }
}