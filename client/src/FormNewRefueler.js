import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl, { useFormControl }  from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function FormNewRefueler({ open, handleClose }) {
  const [name, setName] = useState('');
  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handlerSubmit = (event) => {
    event.preventDefault();
    const urlencoded = new URLSearchParams({ name });

    fetch('http://localhost:3000/refuelers', 
    { 
      method: 'POST', 
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: urlencoded,
    }).finally(() => {
      setName('');
      handleClose();
    })
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style} component="form" onSubmit={handlerSubmit} id="formElem">
        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
            <InputLabel htmlFor="fullname">
              ФИО
            </InputLabel>
            <Input
              id="fullname"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              value={name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <ButtonGroup disableElevation variant="contained" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button type='submit'>Добавить</Button>
            <Button type='button' onClick={handleClose}>Отмена</Button>
          </ButtonGroup>
        </Box>
      </Modal>
    </div>
  );
}