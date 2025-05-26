import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import countries from '../../data/countries.json';
import AutocompleteField from '../../components/AutocompleteField';
import {
  nameValidation,
  emailValidation,
  phoneValidation,
  countryValidation,
} from '../../utils/validation';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function AddUserModal({ open, onClose, onAdd }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
    },
  });

  const onSubmit = (data) => {
    onAdd(data);
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Add New User
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              {...register('name', nameValidation)}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
            <TextField
              label="Email"
              {...register('email', emailValidation)}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
            <TextField
              label="Phone"
              {...register('phone', phoneValidation)}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
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
                />
              )}
            />
            <Button type="submit" variant="contained">
              Add User
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
