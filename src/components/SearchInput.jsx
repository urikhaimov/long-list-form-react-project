import React from 'react';
import { TextField } from '@mui/material';

const SearchInput = ({ label, value, onChange }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        mb: 2, // adds bottom margin (space below the input)
        transition: 'all 0.3s ease',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: '#f5f5f5', // same as InputField and AutocompleteField
          '& fieldset': {
            borderColor: 'grey.300',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          },
          '&:hover fieldset': {
            borderColor: 'primary.light',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}33`,
          },
        },
      }}
      size="small"
    />
  );
};

export default SearchInput;
