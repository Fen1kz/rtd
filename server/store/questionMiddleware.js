import {utilQuestionType, utilAnswerToClient} from '../../shared/actions/act-shared-questions';
import {clientToServer} from '../actions';

export const askQuestion = (questionsStorage, action, next) => {
  const questionId = Math.floor(Math.random() * 0x100000);
  action.data.questionId = questionId;
  return new Promise((resolve) => {
    if (!!questionsStorage[questionId]) throw new Error('questionMiddleware');
    questionsStorage[questionId] = resolve;
    next(action);
  });
};

export const answerQuestion = (action, dispatch) => {
  const {questionId, questionAction} = action.data;
  const {socketId} = action.meta;
  console.log('answerQuestion', questionAction);
  const questionActionFn = clientToServer[questionAction.type];
  if (questionActionFn) {
    return Promise.resolve(dispatch(questionActionFn(questionAction.data, action.meta)))
      .then((data) => {
        console.log('answerQuestion data', questionId, data, socketId);
        dispatch(utilAnswerToClient(questionId, data, socketId))
      });
  }
};

export default (questionsStorage = {}) => store => next => action => {
  if (action.type === utilQuestionType.utilQuestionToClient) {
    throw new Error('NYI')
    // return askQuestion(questionsStorage, action, next);
  } else if (action.type === utilQuestionType.utilQuestionToServer) {
    return answerQuestion(action, store.dispatch)
  } else if (action.type === utilQuestionType.utilAnswerToServer) {
    const {questionId} = action.data;
    if (questionsStorage[questionId]) {
      const resolve = questionsStorage[questionId];
      questionsStorage[questionId] = null;
      resolve(action.data);
    } else {
      next(action.data.action);
    }
  } else {
    return next(action);
  }
}