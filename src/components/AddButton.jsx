import { Button } from '@mui/material';

export default function AddButton({ onClick }) {
  return (
    <Button variant="contained" onClick={onClick}>
      Add User
    </Button>
  );
}
