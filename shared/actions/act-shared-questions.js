import {to$server} from '../actions';

export const utilQuestionType = {
  utilQuestionToClient: '@@questionMiddleware/utilQuestion/toClient'
  , utilAnswerToClient: '@@questionMiddleware/utilAnswer/toClient'
  , utilQuestionToServer: '@@questionMiddleware/utilQuestion/toServer'
  , utilAnswerToServer: '@@questionMiddleware/utilAnswer/toServer'
};

// Server

export const utilQuestionToClient = (questionAction) => ({
  type: utilQuestionType.utilQuestionToClient
  , data: {questionAction}
  , meta: {}
});

export const utilAnswerToClient = (id, data, socketId) => ({
  type: utilQuestionType.utilAnswerToClient
  , data: {id, data}
  , meta: {socketId}
});

// Client

export const utilQuestionToServer = (questionAction, socket) => ({
  type: utilQuestionType.utilQuestionToServer
  , data: {questionAction}
  , meta: {socket, server: true}
});

export const utilAnswerToServer = (id, data) => ({
  type: utilQuestionType.utilAnswerToServer
  , data: {id, data}
  , meta: {server: true}
});