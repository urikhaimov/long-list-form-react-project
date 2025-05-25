import { useUsersContext } from '../../context/usersContext';
import { ACTIONS } from '../users/reducers';
import UsersList from './usersList/UsersList';
import PrimaryButton from '../../components/PrimaryButton';
import styles from './users.module.css';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

function UsersPage() {
  const { users, loading, error, dispatch } = useUsersContext();
  console.log('loading', loading)
  const handleSave = async () => {

    try {
      dispatch({ type: ACTIONS.SAVE_REQUEST });
      await fakeSave(users);

      alert('Users saved successfully!');
    } catch (err) {
      dispatch({ type: ACTIONS.SAVE_FAILURE, payload: { error: err.message } });
    }
  };

  const fakeSave = async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() < 0.8 ? resolve() : reject(new Error('Server error'));
        dispatch({ type: ACTIONS.SAVE_SUCCESS });
      }, 1000);
    });
  };

  return (
    <div className={styles.pageRoot}>
      <div className={styles.pageContentContainer}>
        {loading ? <CircularProgress size={24} color="primary" /> : <UsersList />}

        <div className={styles.rightButtonContainer}>
          {!loading &&
            <PrimaryButton disabled={loading} onClick={handleSave}>
              Save
            </PrimaryButton>
          }

        </div>
      </div>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => dispatch({ type: ACTIONS.SAVE_FAILURE, payload: { error: null } })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => dispatch({ type: ACTIONS.SAVE_FAILURE, payload: { error: null } })}
          severity="error"
          sx={{ width: '100%' }}
        >
          Failed to save users: {error}
        </Alert>
      </Snackbar>
    </div >
  );
}

export default UsersPage;
