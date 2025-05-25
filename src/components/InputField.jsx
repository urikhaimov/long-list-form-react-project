import React from 'react';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const StyledTextField = styled(TextField)({
  boxShadow: 'none',
  textTransform: 'none',
  backgroundColor: '#909196',
  borderRadius: '4px',
});

const InputField = React.forwardRef(({ error, helperText, ...props }, ref) => {
  return (
    <StyledTextField
      {...props}
      inputRef={ref} // pass down react-hook-form's ref
      error={error ? true : undefined} // MUI error prop
      helperText={helperText} // MUI helper text (e.g., validation message)
      variant="outlined"
      size="small"
    />
  );
});

export default InputField;