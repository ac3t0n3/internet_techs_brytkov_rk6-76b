import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState, useEffect, useRef } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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

export default function FormNewAuto({ open, handleClose }) {
  const [id , setId] = useState([]);
  const [refuelers , setRefuelers] = useState([]);
  const brandRef = useRef(null);
  const modelRef = useRef(null);
  const numberRef = useRef(null);
  const percentOfFuelRef = useRef(null);
  const coordinatesRef = useRef(null);

  const handleChange = (event) => {
    setId(event.target.value);
  };

  useEffect(() => {
    if(open) {
    fetch('http://localhost:3000/refuelers')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setRefuelers(data);
      })
      .catch(() => {
        setRefuelers([]);
      })
    }
  }, [open])

  const handlerSubmit = (event) => {
    event.preventDefault();
    const urlencoded = new URLSearchParams({
      brand: brandRef.current.value,
      model: modelRef.current.value,
      registration_number: numberRef.current.value,
      percent_of_fuel: percentOfFuelRef.current.value,
      coordinates: coordinatesRef.current.value,
      refueler_id: id,
    });

    fetch('http://localhost:3000/autos', 
    { 
      method: 'POST', 
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: urlencoded,
    }).finally(() => {
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
            <InputLabel htmlFor="brand">
              Брэнд
            </InputLabel>
            <Input id="brand" inputRef={brandRef}/>
          </FormControl>
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>  
            <InputLabel htmlFor="model">
              Модель
            </InputLabel>
            <Input id="model" inputRef={modelRef}/>
          </FormControl>
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>           
            <InputLabel htmlFor="registration_number">
              Номер
            </InputLabel>
            <Input id="registration_number" inputRef={numberRef}/>
          </FormControl>
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>                        
            <InputLabel htmlFor="percent_of_fuel">
              Процент топлива
            </InputLabel>
            <Input id="percent_of_fuel" inputRef={percentOfFuelRef} />
          </FormControl>  
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>                        
            <InputLabel htmlFor="coordinates">
              Координаты
            </InputLabel>
            <Input id="coordinates" inputRef={coordinatesRef}/>
          </FormControl>                                     
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
            <InputLabel id="refueler_id">Заправщик</InputLabel>
            <Select
              labelId="refueler_id"
              id="refueler_id"
              label="Заправщик"
              onChange={handleChange}
            >
              {refuelers.map(refueler => {
                return <MenuItem value={refueler._id} key={refueler._id}>{refueler.name}</MenuItem>
              })}
            </Select>
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