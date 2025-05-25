import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import {
  Typography,
  Button,
  Box,
} from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import { useUsersContext } from '../../../context/usersContext';
import UserRow from '../userRow/UserRow';
import { ACTIONS } from '../reducers';
import SearchInput from '../../../components/SearchInput';
import styles from '../users.module.css';

function UsersList() {
  const { users, dispatch } = useUsersContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [listWidth, setListWidth] = useState(0);
  const listContainerRef = useRef();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const updateWidth = () => {
      if (listContainerRef.current) {
        setListWidth(listContainerRef.current.getBoundingClientRect().width);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleInputChange = useCallback(
    (id, field, newValue) => {
      dispatch({
        type: ACTIONS.UPDATE_USER,
        payload: { id, field, value: newValue },
      });
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id) => {
      dispatch({ type: ACTIONS.DELETE_USER, payload: { id } });
    },
    [dispatch]
  );

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

 const Row = ({ index, style }) => {
  const user = filteredUsers[index];
  return (
    <div style={style} key={user.id}>
      <Box sx={{ p: 1 }}>
        <UserRow
          user={user}
          handleInputChange={handleInputChange}
          onDelete={handleDelete}
        />
      </Box>
    </div>
  );
};

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

      <Box ref={listContainerRef} sx={{ width: '100%', height: 600 }}>
        {listWidth > 0 && filteredUsers.length > 0 ? (
          <List
            height={350}
            itemCount={filteredUsers.length}
            itemSize={80}  // Adjust based on actual row height
            width={listWidth}
          >
            {Row}
          </List>
        ) : filteredUsers.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" mt={2}>
            No users found.
          </Typography>
        ) : null}
      </Box>
    </div>
  );
}

export default UsersList;
