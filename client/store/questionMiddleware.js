import {utilQuestionType, utilAnswerToClient} from '../../shared/actions/act-shared-questions';

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
  const {socketId} = action.meta.socketId;
  return Promise.resolve(dispatch(questionAction))
    .then((data) => {
      dispatch(utilAnswerToClient(questionId, data, socketId))
    });
};

export default (questionsStorage = {}) => store => next => action => {
  if (action.type === utilQuestionType.utilQuestionToClient) {
    throw new Error('NYI')
    // return answerQuestion(action, store.dispatch)
  } else if (action.type === utilQuestionType.utilQuestionToServer) {
    return askQuestion(questionsStorage, action, next);
  } else if (action.type === utilQuestionType.utilAnswerToClient) {
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