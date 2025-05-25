import { useCallback, useState, useEffect, useMemo } from 'react';
import { Typography, Button, Box, TextField } from '@mui/material';
import { useUsersContext } from '../../../context/usersContext';
import UserRow from '../userRow/UserRow';
import { ACTIONS } from '../reducers';
import SearchInput from '../../../components/SearchInput';
import styles from '../users.module.css';

function UsersList() {
  const { users, dispatch } = useUsersContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  const handleInputChange = useCallback((id, field, newValue) => {
    dispatch({
      type: ACTIONS.UPDATE_USER,
      payload: { id, field, value: newValue },
    });
  }, [dispatch]);

  const handleDelete = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_USER, payload: { id } });
  }, [dispatch]);

  const handleAdd = useCallback(() => {
    const newId = Date.now();
    const newUser = {
      id: newId,
      name: '',
      email: `user${newId}@example.com`,
      phone: '',
      country: '',
    };
    dispatch({ type: ACTIONS.ADD_USER, payload: { newUser } });
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch) ||
        user.country.toLowerCase().includes(lowerSearch)
    );
  }, [debouncedSearchTerm, users]);
  return (
    <div className={styles.usersList}>
      <div className={styles.usersListHeader}>
        <Typography variant="h6">Users List</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Add User
        </Button>
      </div>
      <Box p={2}>
        <SearchInput
          label="Search by name, email, or country"
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </Box>



      <div className={styles.usersListContent}>
        {filteredUsers.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            handleInputChange={handleInputChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default UsersList;
