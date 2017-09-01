import * as PIXI from 'pixi.js'

class Tool {
  constructor(id, events) {
    this.id = id;
    this.events = {};
    Object.keys(events).map(eventName => {
      this.events[eventName] = events[eventName].bind(this);
    });
  }

  on(game) {
    this.game = game;
    Object.keys(this.events).map(eventName => {
      game.stage.on(eventName, this.events[eventName]);
    });
  }

  off() {
    Object.keys(this.events).map(eventName => {
      this.game.stage.off(eventName, this.events[eventName]);
    });
    this.game = null;
  }
}


const SELECT = new Tool('SELECT', {
  click(e) {
    console.log('SELECT', e, this, game)
  }
});

const PAINT = new Tool('PAINT', {
  mouseup(e) {
    // this.game.stage.off('mousemove', this.mousemove);
    // this.game.recalculatePathing();
  }
});

const SET_BASE = new Tool('SET_BASE', {
  click(e) {
    this.game.setBase(e.data.global)
  }
});

export const TOOL = {
  SELECT
  , PAINT
  , SET_BASE
};

export default class UIManager extends PIXI.utils.EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this.selectTool(TOOL.SELECT);
  }

  selectTool(tool) {
    if (this.tool) this.tool.off(this.game);
    this.tool = tool;
    this.tool.on(this.game);
    this.emit('change', {tool: this.tool.id})
  }

  start() {
    this.game.stage.interactive = true;

    window.document.addEventListener('keyup', (e) => {
      switch (e.keyCode) {
        case 49:
          this.selectTool(TOOL.SELECT);
          break;
        case 50:
          this.selectTool(TOOL.PAINT);
          break;
        case 51:
          this.selectTool(TOOL.SET_BASE);
          break;
        default:
          console.log(e.keyCode);
      }
    });
  }

  stop() {
  }
}