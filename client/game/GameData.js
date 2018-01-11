export default {
  c: {
    cellSize: 40
  }
  , actor: {
    CircleActor: {}
    , CreepActor: {}
  }
  , entity: {
    Base: {
      actor: 'CircleActor'
    }
    , Creep: {
      actor: 'CreepActor'
    }
  }
}
