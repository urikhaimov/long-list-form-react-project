// AutocompleteField.jsx
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAutocomplete = styled(Autocomplete)(() => ({
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  boxShadow: 'none',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
}));

const AutocompleteField = ({ options, value, onChange, label, ...rest }) => (
  <StyledAutocomplete
    options={options}
    value={value || ''}
    onChange={(event, newValue) => onChange(newValue)}
    getOptionLabel={(option) => option}
    isOptionEqualToValue={(option, val) => option === val}
    renderInput={(params) => (
      <TextField {...params} label={label} variant="outlined" size="small" />
    )}
    {...rest}
  />
);

export default AutocompleteField;
