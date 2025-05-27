import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  Pagination,
  Fab,
  Fade,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FixedSizeList as List } from 'react-window';
import { useUsersContext } from '../../../context/usersContext';
import UserRow from '../userRow/';
import { ACTIONS } from '../usersReducer';
import SearchInput from '../../../components/SearchInput';
import { localReducer } from './localReducer';
import AddUserModal from '../AddUserModal';
import styles from '../users.module.css';
import debounce from 'lodash/debounce';

const initialState = {
  searchTerm: '',
  debouncedSearchTerm: '',
  listWidth: 0,
  isModalOpen: false,
  currentPage: 1,
  showScrollTop: false,
  saveSuccess: false,
};


const ITEMS_PER_PAGE = 10;

function UsersList({ onRowSaveSuccess = () => {} }) {
  const { users, dispatch } = useUsersContext();
  const [state, localDispatch] = useReducer(localReducer, initialState);
  const {
    searchTerm,
    debouncedSearchTerm,
    listWidth,
    isModalOpen,
    currentPage,
    showScrollTop,
    saveSuccess,
  } = state;

  const listContainerRef = useRef();

  const debouncedSetSearchTerm = useCallback(
    debounce((val) => {
      localDispatch({ type: 'SET_DEBOUNCED_SEARCH_TERM', payload: val });
    }, 300),
    []
  );

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (listContainerRef.current) {
        localDispatch({
          type: 'SET_LIST_WIDTH',
          payload: listContainerRef.current.getBoundingClientRect().width,
        });
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      localDispatch({ type: 'SET_SCROLL_TOP', payload: window.scrollY > 200 });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleAdd = useCallback(
    (newUserData) => {
      const newId = Date.now();
      const newUser = { id: newId, ...newUserData };
      dispatch({ type: ACTIONS.ADD_USER, payload: { newUser } });
    },
    [dispatch]
  );

  const filteredUsers = useMemo(() => {
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch) ||
        user.country.toLowerCase().includes(lowerSearch)
    );
  }, [debouncedSearchTerm, users]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (_, page) => {
    localDispatch({ type: 'SET_PAGE', payload: page });
    window.scrollTo({
      top: listContainerRef.current.offsetTop - 20,
      behavior: 'smooth',
    });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowSaveSuccess = () => {
    localDispatch({ type: 'SET_SAVE_SUCCESS', payload: true });
    setTimeout(() => {
      localDispatch({ type: 'SET_SAVE_SUCCESS', payload: false });
    }, 1500);
  };

  const Row = React.memo(({ index, style }) => {
    const user = paginatedUsers[index];
    if (!user) return null;
    return (
      <div style={{ ...style, padding: '8px 0' }}>
        <Paper elevation={1} sx={{ p: 2, mx: 1 }}>
          <UserRow
            user={user}
            handleInputChange={handleInputChange}
            onDelete={handleDelete}
            onSaveSuccess={handleRowSaveSuccess}
          />
        </Paper>
      </div>
    );
  });

  const isMobile = window.innerWidth < 600;
  const rowHeight = isMobile ? 350 : 100;

  return (
    <Box className={styles.usersList} sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 2 }}
        className={styles.usersListHeader}
      >
        <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
          Users List
        </Typography>
        <Button
          variant="contained"
          onClick={() => localDispatch({ type: 'TOGGLE_MODAL', payload: true })}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Add User
        </Button>
      </Stack>

      <Box className={styles.searchInput}>
        <SearchInput
          label="Search by name, email, or country"
          value={searchTerm}
          onChange={(val) => {
            localDispatch({ type: 'SET_SEARCH_TERM', payload: val });
            debouncedSetSearchTerm(val);
            localDispatch({ type: 'SET_PAGE', payload: 1 });
          }}
        />
      </Box>

      <Box
        ref={listContainerRef}
        sx={{
          width: '100%',
          height: { xs: 'auto', sm: 330 },
          overflowY: 'auto',
          borderRadius: 2,
          backgroundColor: 'background.paper',
          boxShadow: 1,
        }}
      >
        {listWidth > 0 && paginatedUsers.length > 0 ? (
          isMobile ? (
            paginatedUsers.map((user) => (
              <Paper key={user.id} elevation={1} sx={{ p: 2, mx: 1, mb: 1 }}>
                <UserRow
                  user={user}
                  handleInputChange={handleInputChange}
                  onDelete={handleDelete}
                  onSaveSuccess={handleRowSaveSuccess}
                />
              </Paper>
            ))
          ) : (
            <List
              height={listContainerRef.current ? listContainerRef.current.getBoundingClientRect().height : 330}
              itemCount={paginatedUsers.length}
              itemSize={rowHeight}
              width={listWidth}
            >
              {Row}
            </List>
          )
        ) : filteredUsers.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" mt={2}>
            No users found.
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': { color: '#888' },
              '& .Mui-selected': { backgroundColor: 'primary.main', color: '#fff' },
            }}
          />
        )}
      </Box>

      <AddUserModal open={isModalOpen} onClose={() => localDispatch({ type: 'TOGGLE_MODAL', payload: false })} onAdd={handleAdd} />

      <Fade in={showScrollTop}>
        <Fab color="primary" size="small" onClick={handleScrollToTop} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          <KeyboardArrowUpIcon />
        </Fab>
      </Fade>
    </Box>
  );
}

export default UsersList;


