import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { usersReducer, ACTIONS } from '../pages/users/reducers';
import data from '../data/initialUsersData.json';

const UsersContext = createContext();

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: ACTIONS.SET_USERS, payload: data });
    }, 1000);
    return () => clearTimeout(t);
  }, [dispatch]);

  const contextValue = useMemo(() => ({ ...state, dispatch }), [state, dispatch]);

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);

export default UsersContext;
