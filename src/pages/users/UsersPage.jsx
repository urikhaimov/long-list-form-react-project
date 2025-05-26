import { useUsersContext } from '../../context/usersContext';
import UsersList from './usersList/UsersList';
import { Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import { useState } from 'react';
import styles from './users.module.css';

function UsersPage() {
  const { users, loading, error, dispatch } = useUsersContext();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const incompleteCount = users.filter(
    (u) =>
      !u.name ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email) ||
      !/^\+\d{3,}$/.test(u.phone) ||
      !u.country
  ).length;

  const handleSnackbarClose = () => {
    if (error === null) {
      dispatch({ type: 'SAVE_FAILURE', payload: { error: null } });
    }
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  return (
    <Box className={styles.pageRoot}>
      <Box className={styles.pageContentContainer}>
        {incompleteCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {incompleteCount} user(s) have incomplete or invalid information.
          </Alert>
        )}

        {loading ? <CircularProgress size={24} color="primary" /> : <UsersList />}
      </Box>

      <Snackbar
        open={error != null || saveSuccess}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {error ? (
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            Failed to save users: {error}
          </Alert>
        ) : (
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Users saved successfully!
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}

export default UsersPage;
