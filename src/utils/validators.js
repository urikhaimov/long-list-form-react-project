export const validateField = (field, value) => {
  switch (field) {
    case 'name':
      return value.trim() === '' ? 'Name is required' : '';
    case 'country':
      return value.trim() === '' ? 'Country is required' : '';  
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ''
        : 'Invalid email address';
    case 'phone':
      return /^\d{7,}$/.test(value)
        ? ''
        : 'Phone must be at least 7 digits';
    default:
      return '';
  }
};