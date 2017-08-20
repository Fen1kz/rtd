export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];
    return reducer
      ? reducer(state, action.data, action.user)
      : state;

    // With mutations?
    //if (reducer) {
    //  if (state && state.asMutable) {
    //    const result = reducer(state.asMutable(), action.data, action.user);
    //    if (result) {
    //      return result.asImmutable();
    //    } else {
    //      return null;
    //    }
    //  } else {
    //    return reducer(state, action.data, action.user);
    //  }
    //} else {
    //  return state;
    //}
  };
}