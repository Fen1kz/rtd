export default history => store => next => action => {
  if (action.type === '@@historyMiddleware/push') {
    history.push(action.data)
  }
  return next(action);
}