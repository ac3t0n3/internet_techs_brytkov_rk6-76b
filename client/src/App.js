import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ButtonGroup } from '@mui/material';
import FormNewRefueler from './FormNewRefueler';
import FormUpdateAuto from './FormUpdateAuto';
import FormNewAuto from './FormNewAuto';

import './App.css';

function AutosTable({ autos, fetchAutos }) {
  const [refuelers , setRefuelers] = useState([]);
  const [openAutoModal, setOpenAutoModal] = useState(false);
  const handleOpenAutoModal = () => setOpenAutoModal(true);
  const handleCloseAutoModal = () => setOpenAutoModal(false);
  const fetchRefuelers = () => {
    fetch('http://localhost:3000/refuelers')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const map = data.reduce((map, obj) => {
            map[obj._id] = obj;
            return map;
        }, {});
        setRefuelers(map);
      })
      .catch(() => {
        setRefuelers({});
      })
  }
  const handleDelete = (_id) => () => {
    fetch(`http://localhost:3000/autos/${_id}`, {
      method: 'DELETE',
    }).finally(() => {
      fetchAutos();
    })
  };

  useEffect(() => {
    fetchAutos();
    fetchRefuelers();
  }, [openAutoModal])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Марка</TableCell>
            <TableCell align="left">Номер</TableCell>
            <TableCell align="left">Процент топлива</TableCell>
            <TableCell align="left">Координаты</TableCell>
            <TableCell align="left">Заправщик</TableCell>
            <TableCell align="right"></TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {autos.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{row.brand} {row.model}</TableCell>
              <TableCell align="left">{row.registration_number}</TableCell>
              <TableCell align="left">{row.percent_of_fuel}</TableCell>
              <TableCell align="left">{String(row.coordinates)}</TableCell>
              <TableCell align="left">{refuelers[row.refueler_id]?.name || ''}</TableCell>
              <TableCell align="right">
                <ButtonGroup>
                  <Button variant="contained" onClick={handleOpenAutoModal}>Изменить</Button>
                  <FormUpdateAuto open={openAutoModal} handleClose={handleCloseAutoModal} data={row} />
                  <Button variant="contained" onClick={handleDelete(row._id)}>Удалить</Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function App() {
  const [autos, setAutos] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openNewAutoModal, setOpenNewAutoModal] = useState(false);
  const handleOpenNewAutoModal = () => setOpenNewAutoModal(true);
  const handleCloseNewAutoModal = () => {
    fetchAutos();
    setOpenNewAutoModal(false)}
  ;

  const fetchAutos = () => {
    fetch('http://localhost:3000/autos')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAutos(data);
      })
      .catch(() => {
        setAutos([]);
      })
  }

  return (
    <Box sx={{ p: 2, backgroundColor: 'primary.dark', minHeight: '100vh' }}>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 4, mr: 4 }}>Добавить заправщика</Button>
      <Button variant="contained" onClick={handleOpenNewAutoModal} sx={{ mb: 4 }}>Добавить авто</Button>
      <AutosTable autos={autos} fetchAutos={fetchAutos} />
      <FormNewRefueler open={open} handleClose={handleClose} />
      <FormNewAuto open={openNewAutoModal} handleClose={handleCloseNewAutoModal} />
    </Box>
  );
}

export default App;
