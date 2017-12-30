import * as PIXI from 'pixi.js'
import KeyCode from './KeyCode';

class Tool {
  constructor(id, options = {}) {
    this.id = id;
    this.eventNames = options.events || ['click'];
    this.hotkey = options.hotkey;
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

const SELECT = new Tool('SELECT', {hotkey: 49});

const PAINT = new Tool('PAINT', {hotkey: 50});

const SET_BASE = new Tool('SET_BASE', {hotkey: 51});

const UNIT = new Tool('UNIT', {hotkey: 52});

const Tower = new Tool('Tower', {
  hotkey: 53,
  events: ['click', 'mousemove']
});

export const TOOL = {
  SELECT
  , PAINT
  , SET_BASE
  , UNIT
  , Tower
};

export default class UIManager extends PIXI.utils.EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this.selectTool(TOOL.SELECT.id);
  }

  selectTool(toolId) {
    if (this.tool) {
      this.emit(this.tool.id + '.stop', null, toolId);
      this.tool.off(this.game);
    }
    this.tool = TOOL[toolId];
    this.tool.on(this.game, this.listen);
    this.emit('change', {tool: this.tool.id});
    this.emit(toolId + '.start', null, toolId);
  }

  listen = (e, toolId) => {
    this.emit(toolId + '.' + e.type, e, toolId);
    // console.log(toolId + '.' + e.type)
  };

  start() {
    this.game.stage.interactive = true;

    window.document.addEventListener('keyup', (e) => {
      let handled;
      handled = Object.values(TOOL).some((tool) => {
        if (tool.hotkey === e.keyCode) {
          this.selectTool(tool.id);
          return true;
        }
      });
      if (!handled) {
        this.emit('keyup.' + e.keyCode);
      }
    });
  }

  stop() {
  }
}