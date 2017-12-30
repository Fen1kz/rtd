export default {
  c: {
    cellSize: 20
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
