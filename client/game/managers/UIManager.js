import * as PIXI from 'pixi.js'

class Tool {
  constructor(id, eventNames) {
    this.id = id;
    this.eventNames = eventNames;
    this.events = {};
  }

  on(game, listenFn) {
    this.events = {};
    this.eventNames.forEach(eventName => {
      this.events[eventName] = (e) => listenFn(e, this.id);
      game.stage.on(eventName, this.events[eventName]);
    });
  }

  off(game) {
    this.eventNames.map(eventName => {
      game.stage.off(eventName, this.events[eventName]);
    });
    this.events = null;
  }
}


const SELECT = new Tool('SELECT', ['click']);

const PAINT = new Tool('PAINT', ['click']);

const SET_BASE = new Tool('SET_BASE', ['click']);

const UNIT = new Tool('UNIT', ['click']);

export const TOOL = {
  SELECT
  , PAINT
  , SET_BASE
  , UNIT
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
    this.tool.on(this.game, this.listen);
    this.emit('change', {tool: this.tool.id})
  }

  listen = (e, toolId) => {
    this.emit(toolId + '.' + e.type, e, toolId);
    // console.log(toolId + '.' + e.type)
  };

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
        case 52:
          this.selectTool(TOOL.UNIT);
          break;
        default:
          console.log(e.keyCode);
      }
    });
  }

  stop() {
  }
}