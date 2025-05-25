import React from 'react';
import { Box, IconButton } from '@mui/material';
import InputField from '../../../components/InputField';
import AutocompleteField from '../../../components/AutocompleteField';
import TrashIconButton from '../../../components/TrashIconButton';
import countries from '../../../data/countries.json';

const UserRow = ({ user, handleInputChange, onDelete }) => {
  if (!user) return null;
  const { id, name, country, phone, email } = user;

  const hasError = (field, value) => {
    if (field === 'email') {
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if (field === 'phone') {
      return !/^\+\d{3,}$/.test(value);
    }
    return !value;
  };

  const isInvalid = hasError('name', name) || hasError('email', email) || hasError('phone', phone) || hasError('country', country);

  return (
    <Box
      id={`user-row-${id}`}
      tabIndex={-1}
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      gap={2}
      sx={{
        p: 2,
        mb: 1,
        borderRadius: 2,
        backgroundColor: isInvalid ? '#fff3f3' : 'background.paper',
        border: isInvalid ? '1px solid #f44336' : '1px solid transparent',
        boxShadow: 1,
        width: '100%',             // Ensure row doesn’t exceed parent
        boxSizing: 'border-box',   // Prevent width issues with padding
        overflowX: 'hidden',       // Explicitly hide scroll if child misbehaves
      }}
    >
      <InputField
        label="Name"
        value={name}
        error={hasError('name', name)}
        helperText={hasError('name', name) ? 'Name is required' : ''}
        onChange={(e) => handleInputChange(id, 'name', e.target.value)}
        sx={{ width: { xs: '100%', sm: 150 }, flexShrink: 0 }}
      />

      <AutocompleteField
        options={countries}
        value={user.country || null}
        onChange={(val) => handleInputChange(id, 'country', val)}
        label="Select Country"
        error={hasError('country', country)}
        helperText={hasError('country', country) ? 'Country is required' : ''}
        sx={{ width: { xs: '100%', sm: 150 }, flexShrink: 0 }}
        size="small"
      />

      <InputField
        label="Email"
        value={email}
        error={hasError('email', email)}
        helperText={hasError('email', email) ? 'Invalid email' : ''}
        onChange={(e) => handleInputChange(id, 'email', e.target.value)}
        sx={{ width: { xs: '100%', sm: 220 }, flexShrink: 0 }}
      />

      <InputField
        label="Phone"
        value={phone}
        error={hasError('phone', phone)}
        helperText={hasError('phone', phone) ? ' "+" character as first' : ''}
        onChange={(e) => handleInputChange(id, 'phone', e.target.value)}
        sx={{ width: { xs: '100%', sm: 150 }, flexShrink: 0 }}
      />

      <IconButton
        onClick={() => onDelete(id)}
        color="error"
        sx={{
          alignSelf: { xs: 'flex-end', sm: 'center' },
          mt: { xs: 1, sm: 0 },
          flexShrink: 0,
        }}
      >
        <TrashIconButton />
      </IconButton>
    </Box>

  );
};

export default React.memo(UserRow);
