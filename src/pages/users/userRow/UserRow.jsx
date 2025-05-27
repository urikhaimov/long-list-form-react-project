import React, { useEffect, useReducer } from 'react';
import { Box, IconButton, Tooltip, Button, Stack, Fade } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import InputField from '../../../components/InputField';
import AutocompleteField from '../../../components/AutocompleteField';
import TrashIconButton from '../../../components/TrashIconButton';
import countries from '../../../data/countries.json';
import {localReducer} from './localReducer';
import {
  nameValidation,
  emailValidation,
  phoneValidation,
  countryValidation,
} from '../../../utils/validation';
import styles from '../users.module.css';
const initialState = {
  originalData: {},
  justSaved: false,
};
const UserRow = ({ user, handleInputChange, onDelete, onSaveSuccess }) => {
  if (!user) return null;

  const { id, name, country, phone, email } = user;
  const [state, localDispatch] = useReducer(localReducer, initialState);
  const { originalData, justSaved } = state;

  const {
    register,
    reset,
    control,
    formState: { errors, dirtyFields },
    getValues,
    trigger,
  } = useForm({
    mode: 'onChange',
    defaultValues: { name, email, phone, country },
  });

  useEffect(() => {
    localDispatch({
      type: 'SET_ORIGINAL',
      payload: { name, email, phone, country },
    });
    reset({ name, email, phone, country });
  }, [id, reset, name, email, phone, country]);

  const handleResetChanges = () => {
    reset(originalData);
  };

  const handleSaveRow = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();
    for (const key of Object.keys(values)) {
      if (user[key] !== values[key]) {
        handleInputChange(id, key, values[key]);
      }
    }
    localDispatch({ type: 'SET_ORIGINAL', payload: values });
    reset(values);
    localDispatch({ type: 'SET_JUST_SAVED', payload: true });
    onSaveSuccess?.();
    setTimeout(() => localDispatch({ type: 'SET_JUST_SAVED', payload: false }), 1500);
  };

  const isDirty = Object.keys(dirtyFields).length > 0;

  return (
    <Fade in timeout={500} key={id}>
      <Box
        className={`${styles.userRow} ${isDirty ? styles.warningHighlight : ''}`}
        display="flex"
        alignItems="center"
        flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
        gap={2}
        p={2}
        borderRadius={2}
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: justSaved ? '#e6f4ea' : isDirty ? '#fff3e0' : '#f9f9f9',
          border: justSaved
            ? '2px solid #4caf50'
            : isDirty
              ? '1px solid #ffa726'
              : '1px solid transparent',
          transition: 'background-color 0.4s ease, border 0.4s ease',
        }}
        id={`user-row-${id}`}
      >
        <InputField
          label="Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name', { ...nameValidation })}
          sx={{ flex: '1 1 150px' }}
        />

        <Controller
          name="country"
          control={control}
          rules={countryValidation}
          render={({ field }) => (
            <AutocompleteField
              options={countries}
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
              label="Country"
              error={!!errors.country}
              helperText={errors.country?.message}
              sx={{ flex: '1 1 150px' }}
            />
          )}
        />

        <InputField
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email', { ...emailValidation })}
          sx={{ flex: '2 1 220px' }}
        />

        <InputField
          label="Phone"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register('phone', { ...phoneValidation })}
          sx={{ flex: '1 1 150px' }}
        />

        <Stack direction="row" alignItems="center" spacing={1}>
          {isDirty && (
            <>
              <Tooltip title="Save this row">
                <Button size="small" variant="outlined" color="success" onClick={handleSaveRow}>
                  Save
                </Button>
              </Tooltip>
              <Tooltip title="Reset unsaved changes">
                <Button size="small" color="warning" onClick={handleResetChanges}>
                  Reset
                </Button>
              </Tooltip>
            </>
          )}
          <Tooltip title={`Delete user ${name}`}>
            <IconButton
              onClick={() => onDelete(id)}
              color="error"
              aria-label={`Delete user ${name}`}
            >
              <TrashIconButton />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Fade>
  );
};

export default React.memo(UserRow);