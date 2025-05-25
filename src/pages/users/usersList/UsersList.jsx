import { useCallback } from 'react';
import { Typography, Button } from '@mui/material';
import { useUsersContext } from '../../../context/usersContext';
import UserRow from '../userRow/UserRow';
import { ACTIONS } from '../reducers';
import styles from '../users.module.css';

function UsersList() {
  const { users, dispatch } = useUsersContext();

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

  return (
    <div className={styles.usersList}>
      <div className={styles.usersListHeader}>
        <Typography variant="h6">Users List</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Add User
        </Button>
      </div>
      <div className={styles.usersListContent}>
        {users.map((user) => (
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
