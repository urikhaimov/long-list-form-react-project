
export const nameValidation = {
  required: 'Name is required',
  pattern: {
    value:  /^[\p{Script=Latin}\s\-']+$/u,
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
    message: 'Invalid email format (must be +)',
  },
};

export const countryValidation = {
  required: 'Country is required',
};
