import React, { useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import InputField from '../../../components/InputField';
import AutocompleteField from '../../../components/AutocompleteField';
import TrashIconButton from '../../../components/TrashIconButton';
import countries from '../../../data/countries.json';
import {
  nameValidation,
  emailValidation,
  phoneValidation,
} from '../../../utils/validation';

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
    defaultValues: { name, email, phone, country },
  });

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
      flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
      gap={2}
      p={2}
      borderRadius={2}
      bgcolor="#f9f9f9"
      sx={{ width: '100%', boxSizing: 'border-box' }}
    >
      <InputField
        label="Name"
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name', {
          ...nameValidation,
          onChange: (e) => onValidFieldChange('name', e.target.value),
        })}
        sx={{ flex: '1 1 150px' }}
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
            label="Country"
            sx={{ flex: '1 1 150px' }}
          />
        )}
      />

      <InputField
        label="Email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email', {
          ...emailValidation,
          onChange: (e) => onValidFieldChange('email', e.target.value),
        })}
        sx={{ flex: '2 1 220px' }}
      />

      <InputField
        label="Phone"
        error={!!errors.phone}
        helperText={errors.phone?.message}
        {...register('phone', {
          ...phoneValidation,
          onChange: (e) => onValidFieldChange('phone', e.target.value),
        })}
        sx={{ flex: '1 1 150px' }}
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
