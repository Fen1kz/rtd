export const socketConnect = (socket) => ({
  type: 'socketConnect'
  , data: {socket}
});

export const socketDisconnect = (socketId) => ({
  type: 'socketDisconnect'
  , data: {socketId}
});