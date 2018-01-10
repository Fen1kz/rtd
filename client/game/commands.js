import KeyCode from "./managers/KeyCode";

export default (game) => {
  game.ui.on('Tower.start', () => {
    const level = game.level;
    console.log('start')
  });
  game.ui.on('Tower.mousemove', (e) => {
    const level = game.level;
    level.state.towerPoint = e.data.global;
    level.stateGfx.position.set(level.state.towerPoint.x, level.state.towerPoint.y);
  });
  game.ui.on('Tower.stop', () => {
    const level = game.level;
    level.stateGfx.position.set(-50, -50);
    console.log('stop', level.stateGfx.position)
    setTimeout(() => {
      console.log('stop', level.stateGfx.position)
    }, 2000)
  });


  game.ui.on('SELECT.click', (e) => {
    level.stateGfx.position.set(-50, -50);
    //   const [x, y] = game.level.grid.getCellByPoint(e.data.global);
    //   game.level.render();
    //   game.level.grid.renderFF(game.level.gridGfx, game.level.grid.getFF(x + ':' + y));
  });
  game.ui.on('PAINT.click', (e) => {
    const {x, y} = e.data.global;
    console.log(x, y, game.level.state.polygon)
    if (!game.level.state.polygon) {
      game.level.state.polygon = [];
    }
    if (Math.abs(game.level.state.polygon[0] - x) < DRAW_POLYGON_CIRCLE && Math.abs(game.level.state.polygon[1] - y) < DRAW_POLYGON_CIRCLE) {
      if (game.level.state.polygon.length > 2) {
        game.level.addWall(game.level.state.polygon);
      }
      game.level.state.polygon = null;
    } else {
      game.level.state.polygon.push(x);
      game.level.state.polygon.push(y);
    }
    game.level.recalculate();
    game.level.render();
  });

  game.ui.on('SET_BASE.click', (e) => {
    game.level.base.loc.copy(e.data.global)
    game.level.recalculate();
    setTimeout(() => {
      game.level.render();
    }, 1e3)
  });

  game.ui.on('UNIT.click', (e) => {
    const creep = game.level.addEntity(Creep);
    creep.loc.copy(e.data.global);
  });

  game.ui.on('SPAWN', (i) => Array(i).fill().forEach(() => game.level.spawn()));

  game.ui.on('DEBUG', () => {
    game.level.render();
  });

  // game.ui.on('keyup.'+KeyCode.SPACEBAR, () => {
  //   console.log('space');
  //   game.tick();
  // });
};