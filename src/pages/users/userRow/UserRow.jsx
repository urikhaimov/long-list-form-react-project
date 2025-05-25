import React, { useEffect } from 'react';
import { Grid, Box, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import InputField from '../../../components/InputField';
import AutocompleteField from '../../../components/AutocompleteField'; // Correct import path
import TrashIconButton from '../../../components/TrashIconButton';
import countries from '../../../data/countries.json';
import styles from '../users.module.css';



const UserRow = ({ user, handleInputChange, onDelete }) => {
  if (!user) return null;
  const { id, name, country, phone, email } = user;

  const {
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name,
      email,
      phone,
    },
  });

  // Sync initial values from props
  useEffect(() => {
    reset({ name, email, phone });
    setValue('country', country);
  }, [name, email, phone, country, reset, setValue]);

  const onValidFieldChange = (field, value) => {
    handleInputChange(id, field, value);
  };

  return (
    <Grid container className={styles.userRow}>
      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        p={2}
        borderRadius={2}
        bgcolor="#f9f9f9"
        sx={{ width: '100%', minHeight: 140, boxSizing: 'border-box' }}
      >
        <InputField
          label="Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            onChange: (e) => onValidFieldChange('name', e.target.value),
          })}
          fullWidth
        />

        <AutocompleteField
          options={countries}
          value={country}
          onChange={(newValue) => onValidFieldChange('country', newValue)}
          label="Select Country"
           fullWidth
        />

        <InputField
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
            onChange: (e) => onValidFieldChange('email', e.target.value),
          })}
          fullWidth
        />

        <InputField
          label="Phone"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register('phone', {
            required: 'Phone is required',
            pattern: {
              value: /^\d{7,}$/,
              message: 'Phone must be at least 7 digits',
            },
            onChange: (e) => onValidFieldChange('phone', e.target.value),
          })}
          fullWidth
        />

        <IconButton
          onClick={() => onDelete(id)}
          color="error"
          sx={{ alignSelf: 'flex-start' }}
        >
          <TrashIconButton />
        </IconButton>
      </Box>
    </Grid>
  );
};

export default React.memo(UserRow);
