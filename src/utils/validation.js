
export const nameValidation = {
  required: 'Name is required',
  pattern: {
    value: /^[a-zA-Z\s'-]+$/,
    message: 'Invalid name format',
  },
};

export const emailValidation = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format',
  },
};

export const phoneValidation = {
  required: 'Phone is required',
  pattern: {
    value: /^\+\d{7,}$/,
    message: 'Phone must be at least 7 digits and +',
  },
};

export const countryValidation = {
  required: 'Country is required',
};
