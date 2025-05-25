import { Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAutocomplete = styled(Autocomplete)({
  boxShadow: 'none',
  textTransform: 'none',
  backgroundColor: '#909196',
  borderRadius: '4px',
});

const AutocompleteField = ({
  options,
  value,
  onChange,
  label,
  optionKey = null, // optional: use for object options like 'code'
  ...rest
}) => {
  // Check if the value matches any option
  const matchedValue = options.find((opt) => {
    if (typeof opt === 'string') {
      return opt === value;
    } else if (optionKey) {
      return opt[optionKey] === value[optionKey];
    } else {
      return opt === value;
    }
  }) || null;

  return (
    <StyledAutocomplete
      options={options}
      value={matchedValue}
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) =>
        typeof option === 'string'
          ? option
          : option.label || ''
      }
      isOptionEqualToValue={(option, val) => {
        if (typeof option === 'string') {
          return option === val;
        } else if (optionKey) {
          return option[optionKey] === val?.[optionKey];
        } else {
          return option === val;
        }
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
      {...rest}
    />
  );
};

AutocompleteField.defaultProps = {
  options: [],
  value: null, // important: null instead of ''
  onChange: () => {},
  label: '',
  optionKey: null, // optional: e.g., 'code'
};

export default AutocompleteField;
