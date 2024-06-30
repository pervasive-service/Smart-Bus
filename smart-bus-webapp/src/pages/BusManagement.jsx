import React, { useState, useEffect } from "react";
import { Button, Table, TableHead, TableBody, TableRow, TableCell, TextField, Box, Grid, Chip } from '@mui/material';
import BusModal from './BusModal';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import "./BusManagement.css"

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([]);
  const [currentBus, setCurrentBus] = useState({
    id: "",
    name: "",
    date: "",
    time: "",
    stops: [],
    destination: "",
    departureTime: "",
    busNumber: "",
    driver: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const sampleBuses = [
      {
        id: "1",
        name: "Bus 1",
        date: "2024-07-01",
        time: "10:00",
        stops: ["Stop 1", "Stop 2"],
        destination: "Destination 1",
        departureTime: "09:00",
        busNumber: "BUS-001",
        driver: "John Doe",
      },
      {
        id: "2",
        name: "Bus 2",
        date: "2024-07-02",
        time: "11:00",
        stops: ["Stop 3", "Stop 4"],
        destination: "Destination 2",
        departureTime: "10:00",
        busNumber: "BUS-002",
        driver: "Jane Smith",
      },
    ];
    setBuses(sampleBuses);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBus({ ...currentBus, [name]: value });
  };

  const handleStopsChange = (stops) => {
    setCurrentBus({ ...currentBus, stops });
  };

  const handleAddBus = () => {
    setBuses([...buses, { ...currentBus, id: Date.now().toString() }]);
    setCurrentBus({
      id: "",
      name: "",
      date: "",
      time: "",
      stops: [],
      destination: "",
      departureTime: "",
      busNumber: "",
      driver: "",
    });
    setShowModal(false);
  };

  const handleEditBus = (id) => {
    const bus = buses.find((bus) => bus.id === id);
    setCurrentBus(bus);
    setShowModal(true);
  };

  const handleUpdateBus = () => {
    setBuses(
      buses.map((bus) => (bus.id === currentBus.id ? currentBus : bus))
    );
    setCurrentBus({
      id: "",
      name: "",
      date: "",
      time: "",
      stops: [],
      destination: "",
      departureTime: "",
      busNumber: "",
      driver: "",
    });
    setShowModal(false);
  };

  const handleDeleteBus = (id) => {
    setBuses(buses.filter((bus) => bus.id !== id));
  };

  const handleOpenModal = () => {
    setCurrentBus({
      id: "",
      name: "",
      date: "",
      time: "",
      stops: [],
      destination: "",
      departureTime: "",
      busNumber: "",
      driver: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (currentBus.id) {
      handleUpdateBus();
    } else {
      handleAddBus();
    }
  };

  const filteredBuses = buses.filter(
    (bus) =>
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.length === 0 ||
        filters.some((filter) => bus.stops.includes(filter)))
  );

  const handleAddFilter = (filter) => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter]);
    }
  };

  const handleDeleteFilter = (filter) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  return (
    <>
      <h1>Bus Management Page</h1>
      <div className="container">
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={10} sm={9}>
            <TextField
              id="search"
              label="Search by Bus Name"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
            />
          </Grid>
          <Grid item xs={8} sm={3} style={{ textAlign: "right" }}>
            <Button
              className="add-button"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
            >
              Add Bus
            </Button>
          </Grid>
        </Grid>
        <Box mt={2}>
          {filters.map(filter => (
            <Chip
              key={filter}
              label={filter}
              onDelete={() => handleDeleteFilter(filter)}
              color="primary"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        <BusModal
          show={showModal}
          handleClose={handleCloseModal}
          bus={currentBus}
          handleInputChange={handleInputChange}
          handleStopsChange={handleStopsChange}
          handleSubmit={handleSubmit}
        />
        <h2>Bus List</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bus Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Stops</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Departure Time</TableCell>
              <TableCell>Bus Number</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBuses.map((bus) => (
              <TableRow key={bus.id}>
                <TableCell>{bus.name}</TableCell>
                <TableCell>{bus.date}</TableCell>
                <TableCell>{bus.time}</TableCell>
                <TableCell>{bus.stops.join(", ")}</TableCell>
                <TableCell>{bus.destination}</TableCell>
                <TableCell>{bus.departureTime}</TableCell>
                <TableCell>{bus.busNumber}</TableCell>
                <TableCell>{bus.driver}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEditBus(bus.id)}>
                    <EditIcon />
                  </Button>
                  <Button size="small" onClick={() => handleDeleteBus(bus.id)}>
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default BusManagement;
