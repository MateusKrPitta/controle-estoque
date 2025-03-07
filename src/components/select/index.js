import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

export default function SelectTextFields({
  size = 'medium',
  label,
  value,
  onChange,
  fullWidth = false,
  width,
  icon,
  disabled = false,
  borderRadius,
  options = [],
  optionFontSize = '0.875rem',
  placeholder,
  height,
  multiple = false, // Adicionando a propriedade multiple
}) {
  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-select-currency"
        select
        size={size}
        label={label}
        fullWidth={fullWidth}
        placeholder={placeholder || 'Selecione'}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          borderRadius: borderRadius,
          width: fullWidth ? '100%' : width,
          backgroundColor: 'white',
          margin: '0px',
        }}
        InputLabelProps={{
          style: {
            fontSize: '13px',
          },
        }}
        InputProps={{
          startAdornment: icon && (
            <InputAdornment position="start">{icon}</InputAdornment>
          ),
          style: {
            height: height || '36px',
            fontSize: '13px',
            padding: '10px 8px',
            appearance: 'none',
            MozAppearance: 'textfield',
          },
        }}
        SelectProps={{
          multiple, // Adicionando a propriedade multiple
        }}
      >
        {options.map((option) => (
          <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            fontSize: optionFontSize,
            padding: '4px 8px',
            '&:hover': {
              backgroundColor: '#BCDA72', // Highlight color on hover
            },
            '&.Mui-selected': {
              backgroundColor: '#BCDA72', // Highlight color when selected
              '&:hover': {
                backgroundColor: '#BCDA72', // Keep the same color on hover when selected
              },
            },
          }}
        >
          {option.label}
        </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}