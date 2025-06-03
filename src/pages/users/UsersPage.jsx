import { useReducer, useMemo  } from 'react';
import { useUsersContext } from '../../context/usersContext';
import UsersList from './usersList/';
import {usersReducer } from './usersReducer'
import { Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import styles from './users.module.css';

const initialState = {
  users: [],
  error: null,
  loading: false,
  saveSuccess: false, // NEW!
};

function UsersPage() {
  const { users, isLoading, error, dispatch, saveSuccess } = useUsersContext();
  const [state, localDispatch] = useReducer(usersReducer, initialState);
  

  const incompleteCount = useMemo(
    () =>
      users.filter(
        (u) =>
          !u.name ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email) ||
          !/^\+\d{3,}$/.test(u.phone) ||
          !u.country
      ).length,
    [users]
  );

  const handleSnackbarClose = () => {
    if (error) {
      dispatch({ type: 'SAVE_FAILURE', payload: { error: null } });
    }
    if (saveSuccess) {
      localDispatch({ type: 'SET_SAVE_SUCCESS', payload: false });
    }
  };

  const handleRowSaveSuccess = () => {
    localDispatch({ type: 'SET_SAVE_SUCCESS', payload: true });
  };

  return (
    <Box className={styles.pageRoot}>
      <Box className={styles.pageContentContainer}>
        {incompleteCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {incompleteCount} user(s) have incomplete or invalid information.
          </Alert>
        )}

        {isLoading ? (
          <CircularProgress size={24} color="primary" />
        ) : (
          <UsersList onRowSaveSuccess={handleRowSaveSuccess} />
        )}
      </Box>

      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {error ? (
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            Failed to save users: {error}
          </Alert>
        ) : (
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            User saved successfully!
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}

export default UsersPage;
