export const to$server = (action) => {
  action.meta.server = true;
  return action;
};

export * from './act-shared-questions';
export * from './act-shared-sockets';
export * from './act-shared-users';
export * from './act-shared-games';