import { useState, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react';
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
import UserRow from '../userRow/UserRow';
import { ACTIONS } from '../reducers';
import SearchInput from '../../../components/SearchInput';
import { localReducer } from '../usersList/localReducer';
import AddUserModal from '../AddUserModal';
import styles from '../users.module.css';
import debounce from 'lodash/debounce';


const initialState = {
  searchTerm: '',
  debouncedSearchTerm: '',
  listWidth: 0,
};

const ITEMS_PER_PAGE = 10;

function UsersList({ onRowSaveSuccess = () => { } }) {
  const { users, dispatch } = useUsersContext();
  const [state, localDispatch] = useReducer(localReducer, initialState);
  const { searchTerm, debouncedSearchTerm, listWidth } = state;
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const listContainerRef = useRef();
  const [showScrollTop, setShowScrollTop] = useState(false);
const debouncedSetSearchTerm = useCallback(
  debounce((val) => {
    localDispatch({ type: 'SET_DEBOUNCED_SEARCH_TERM', payload: val });
  }, 300),
  []
);
  useEffect(() => {
    const handler = setTimeout(() => {
      localDispatch({ type: 'SET_DEBOUNCED_SEARCH_TERM', payload: searchTerm });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
      setShowScrollTop(window.scrollY > 200);
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
    setCurrentPage(page);
    window.scrollTo({
      top: listContainerRef.current.offsetTop - 20,
      behavior: 'smooth',
    });
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const Row = ({ index, style }) => {
    const user = paginatedUsers[index];
    return (
      <Fade in timeout={500} key={user.id}>
        <div style={{ ...style, padding: '8px 0' }} className="flash-row">
          <Paper elevation={1} sx={{ p: 2, mx: 1 }}>
            <UserRow
              user={user}
              handleInputChange={handleInputChange}
              onDelete={handleDelete}
              onSaveSuccess={onRowSaveSuccess}
            />
          </Paper>
        </div>
      </Fade>
    );
  };

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
          onClick={() => setModalOpen(true)}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Add User
        </Button>
      </Stack>

      <Box sx={{ mb: 2 }}>

        <SearchInput
          label="Search by name, email, or country"
          value={searchTerm}
          onChange={(val) => {
            localDispatch({ type: 'SET_SEARCH_TERM', payload: val });
            debouncedSetSearchTerm(val);
            setCurrentPage(1);
          }}
        />
      </Box>

      <Box
        ref={listContainerRef}
        sx={{
          width: '100%',
          height: { xs: 300, sm: 330 },
          borderRadius: 2,
          backgroundColor: 'background.paper',
          boxShadow: 1,
          overflow: 'hidden',
        }}
      >
        {listWidth > 0 && paginatedUsers.length > 0 ? (
          <List height={330} itemCount={paginatedUsers.length} itemSize={100} width={listWidth}>
            {Row}
          </List>
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
              '& .MuiPaginationItem-root': {
                color: '#888',
              },
              '& .Mui-selected': {
                backgroundColor: 'primary.main',
                color: '#fff',
              },
            }}
          />
        )}
      </Box>

      <AddUserModal open={isModalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />

      <Fade in={showScrollTop}>
        <Fab
          color="primary"
          size="small"
          onClick={handleScrollToTop}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Fade>
    </Box>
  );
}

export default UsersList;
