import { useUsersContext } from '../../context/usersContext';
import { ACTIONS } from '../users/reducers';
import UsersList from './usersList/UsersList';
import PrimaryButton from '../../components/PrimaryButton';
import { Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import { useState } from 'react';
import styles from './users.module.css';

function UsersPage() {
  const { users, loading, error, dispatch } = useUsersContext();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    const firstInvalidUser = users.find(
      (u) => !u.name || !u.email || !u.phone || !u.country
    );

    if (firstInvalidUser) {
      const row = document.getElementById(`user-row-${firstInvalidUser.id}`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.focus?.();
      }
      return;
    }

    try {
      dispatch({ type: ACTIONS.SAVE_REQUEST });
      await fakeSave(users);
      dispatch({ type: ACTIONS.SAVE_SUCCESS });
      setSaveSuccess(true);
    } catch (err) {
      dispatch({ type: ACTIONS.SAVE_FAILURE, payload: { error: err.message } });
    }
  };

  const fakeSave = async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() < 0.8 ? resolve() : reject(new Error('Server error'));
      }, 1000);
    });
  };

  const incompleteCount = users.filter(
    (u) => !u.name || !u.email || !u.phone || !u.country
  ).length;

  const handleSnackbarClose = () => {
    if (error) {
      dispatch({ type: ACTIONS.SAVE_FAILURE, payload: { error: null } });
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

        <Box className={styles.rightButtonContainer} sx={{ mt: 2 }}>
          <PrimaryButton disabled={loading} onClick={handleSave}>
            {loading ? 'Saving...' : 'Save'}
          </PrimaryButton>
        </Box>
      </Box>

      <Snackbar
        open={!!error || saveSuccess}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {error ? (
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: '100%' }}
          >
            Failed to save users: {error}
          </Alert>
        ) : (
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            Users saved successfully!
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}

export default UsersPage;
