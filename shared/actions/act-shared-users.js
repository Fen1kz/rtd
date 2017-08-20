export const userLogin = (user) => ({
  type: 'userLogin'
  , data: {user}
});

export const userLogout = (userId) => ({
  type: 'userLogout'
  , data: {userId}
});