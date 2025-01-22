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
  options = [], // Tamanho da fonte do TextField
  optionFontSize = '0.875rem',
  placeholder,
  height, // Novo prop para o tamanho das opções
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
          width: fullWidth ? '100%' : width,
          backgroundColor: 'white',
          margin: '0px',
        }}
        InputLabelProps={{
          style: {
            fontSize: '13px', // Ajusta o tamanho da fonte do label
          },
        }}
        InputProps={{
          startAdornment: icon && (
            <InputAdornment position="start">{icon}</InputAdornment>
          ),
          style: {
            height: height || '36px', // Define a altura do select
            fontSize: '13px',
            padding: '10px 8px', // Reduz o padding interno
            appearance: 'none',
            MozAppearance: 'textfield',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              fontSize: optionFontSize, // Tamanho da fonte das opções
              padding: '4px 8px', // Reduz o padding das opções
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>

    </Box>
  );
}
