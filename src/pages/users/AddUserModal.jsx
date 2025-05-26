import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import AutocompleteField from '../../components/AutocompleteField';
import countries from '../../data/countries.json';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCountryChange = (selected) => {
    setFormData((prev) => ({ ...prev, country: selected || '' }));
    setErrors((prev) => ({ ...prev, country: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const country = formData.country;

    if (!name) newErrors.name = nameValidation.required;
    if (!country) newErrors.country = countryValidation.required;

    if (!email) {
      newErrors.email = emailValidation.required;
    } else if (!emailValidation.pattern.value.test(email)) {
      newErrors.email = emailValidation.pattern.message;
    }

    if (!phone) {
      newErrors.phone = phoneValidation.required;
    } else if (!phoneValidation.pattern.value.test(phone)) {
      newErrors.phone = phoneValidation.pattern.message;
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onAdd(formData);
    setFormData({ name: '', email: '', phone: '', country: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Add New User
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <AutocompleteField
            options={countries}
            value={formData.country}
            onChange={handleCountryChange}
            label="Country"
            error={!!errors.country}
            helperText={errors.country}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Add User
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
