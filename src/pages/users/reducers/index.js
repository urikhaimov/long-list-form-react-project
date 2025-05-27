
export const ACTIONS = {
  SET_USERS: 'set-users',
  UPDATE_USER: 'update-user',
  DELETE_USER: 'delete-user',
  ADD_USER: 'add-user',
  SAVE_REQUEST: 'save-request',
  SAVE_SUCCESS: 'save-success',
  SAVE_FAILURE: 'save-failure',
  CLEAR_STATE: 'clear-state',
};

export function usersReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USERS:
      return { ...state, users: action.payload, loading: false, error: null };
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? { ...user, [action.payload.field]: action.payload.value } : user
        ),
      };
    case ACTIONS.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload.id),
      };
    case ACTIONS.ADD_USER:
      return {
        ...state,
        loading: false,
        error: null,
        users: [action.payload.newUser, ...state.users],
      };
    case ACTIONS.SAVE_REQUEST:
      return { ...state, loading: true, error: null };
    case ACTIONS.SAVE_SUCCESS:
      return { ...state, loading: false, error: null };
    case ACTIONS.SAVE_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
}
