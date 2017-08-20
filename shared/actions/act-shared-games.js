export const gameCreate = (game) => ({
  type: 'gameCreate'
  , data: {game}
});

export const gameJoin = (gameId, userId) => ({
  type: 'gameJoin'
  , data: {gameId, userId}
});

export const gameLeave = (gameId, userId) => ({
  type: 'gameLeave'
  , data: {gameId, userId}
});