export default {
  FOLLOW: (entity) => ({type: 'FOLLOW', data: {entity}})
  , MOVE: (point) => ({type: 'MOVE', data: {point}})
};