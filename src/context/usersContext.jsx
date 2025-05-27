import { createContext, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import data from '../data/initialUsersData.json';

const UsersContext = createContext();

const fetchUsers = async () => {
  await new Promise((res) => setTimeout(res, 1000));
  return data;
};

export const ContextProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const addUser = (newUser) => {
    queryClient.setQueryData(['users'], (old = []) => [
      { id: Date.now(), ...newUser },  // put new user first
      ...old,
    ]);
  };
  const updateUser = (id, field, value) => {
    queryClient.setQueryData(['users'], (old = []) =>
      old.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const deleteUser = (id) => {
    queryClient.setQueryData(['users'], (old = []) => old.filter((u) => u.id !== id));
  };

  const contextValue = useMemo(
    () => ({
      users,
      isLoading,
      error,
      refetch,
      addUser,
      updateUser,
      deleteUser,
    }),
    [users, isLoading, error, refetch]
  );

  return <UsersContext.Provider value={contextValue}>{children}</UsersContext.Provider>;
};

export const useUsersContext = () => useContext(UsersContext);

export default UsersContext;
