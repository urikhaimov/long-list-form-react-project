import React, { useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import InputField from '../../../components/InputField';
import AutocompleteField from '../../../components/AutocompleteField';
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
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name,
      email,
      phone,
      country,
    },
  });

  // Sync when ID (user) changes
  useEffect(() => {
    reset({ name, email, phone, country });
  }, [id, name, email, phone, country, reset]);

  const onValidFieldChange = (field, value) => {
    if (user[field] !== value) {
      handleInputChange(id, field, value);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      p={1}
      borderRadius={2}
      bgcolor="#f9f9f9"
      className={styles.userRow}
      sx={{ width: '100%', boxSizing: 'border-box' }}
    >
      <InputField
        label="Name"
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          onChange: (e) => onValidFieldChange('name', e.target.value),
        })}
        sx={{ width: 150 }}
      />

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <AutocompleteField
            options={countries}
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
              onValidFieldChange('country', newValue);
            }}
            label="Select Country"
            sx={{ width: 150 }}
            size="small"
          />
        )}
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
        sx={{ width: 220 }}
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
        sx={{ width: 150 }}
      />

      <IconButton
        onClick={() => onDelete(id)}
        color="error"
        aria-label={`Delete user ${name}`}
        sx={{ alignSelf: 'center' }}
      >
        <TrashIconButton />
      </IconButton>
    </Box>
  );
};

export default React.memo(UserRow);
