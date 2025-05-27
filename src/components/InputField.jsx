// InputField.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  boxShadow: 'none',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const InputField = React.forwardRef(({ error, helperText, ...props }, ref) => (
  <StyledTextField
    {...props}
    inputRef={ref}
    error={!!error}
    helperText={helperText}
    variant="outlined"
    size="small"
  />
));

export default InputField;
