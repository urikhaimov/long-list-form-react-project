import { Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAutocomplete = styled(Autocomplete)(() => ({
  boxShadow: 'none',
  textTransform: 'none',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
}));

const AutocompleteField = ({ options, value, onChange, label, ...rest }) => {
  return (
    <StyledAutocomplete
      options={options}
      value={value || ''}
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option}
      isOptionEqualToValue={(option, val) => option === val}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      {...rest}
    />
  );
};

export default AutocompleteField;
