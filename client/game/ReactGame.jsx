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
    const Tool = ({tool}) => (
      <button
        onClick={() => this.game.ui.selectTool(tool.id)}
        style={{background: this.state.tool === tool.id ? 'red' : 'transparent'}}
      >{tool.id}</button>
    );
    return (<div>
      <div id="game" ref={this.gameMounted}/>
      <div>
        <button onClick={() => this.game.ui.emit('SPAWN', 1)}>S1</button>
        <button onClick={() => this.game.ui.emit('SPAWN', 5)}>S5</button>
        <button onClick={() => this.game.ui.emit('SPAWN', 50)}>S50</button>
        <button onClick={() => this.game.ui.emit('DEBUG')}>DBG</button>
        <Tool tool={TOOL.SELECT}>P</Tool>
        <Tool tool={TOOL.PAINT}>P</Tool>
        <Tool tool={TOOL.SET_BASE}>B</Tool>
        <Tool tool={TOOL.UNIT}>U</Tool>
        <Tool tool={TOOL.Tower}>T</Tool>
      </div>
    </div>);
  }
}