import { Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
const StyledAutocomplete = styled(Autocomplete)({
  boxShadow: 'none',
  textTransform: 'none',
  backgroundColor: '#909196',
  borderRadius: '4px',
});
const AutocompleteField = ({ options, value, onChange, label, ...rest }) => {
  return (
    <StyledAutocomplete
      options={options}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option}  // handle string options
      isOptionEqualToValue={(option, val) => option === val}  // string equality
      renderInput={(params) => <TextField {...params} label={label} />}
      {...rest}
    />
  );
};

AutocompleteField.defaultProps = {
  options: [],
  value: '',
  onChange: () => {},
  label: '',
};

export default AutocompleteField;
