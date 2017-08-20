export default () => store => next => action => {
  if (action && action.meta && action.meta.api) {
    return fetch('/api/' + action.meta.api, {
      method: action.meta.method || 'GET'
      , body: JSON.stringify(action.data)
      , headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
  }
  return next(action);
}