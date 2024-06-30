// src/components/common/Input.jsx
import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
  />
);

export default Input;
