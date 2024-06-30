// src/pages/TripManagement.jsx
import "./TripManagement.css";
// src/pages/TripManagement.jsx
import React, { useState, useEffect } from "react";
// import { Button, Table, TableHead, TableBody, TableRow, TableCell, TextField, Box, Grid } from '@mui/material';
import { Button, Table, TableHead, TableBody, TableRow, TableCell, TextField, Box, Grid, Chip, IconButton, Modal, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import TripModal from './TripModal';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([]);
  const [currentTrip, setCurrentTrip] = useState({
    id: "",
    name: "",
    date: "",
    time: "",
    stops: [],
    destination: "",
    departureTime: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch trips (useEffect can be used if fetching from an API)
  useEffect(() => {
    // Sample data, replace with API call if needed
    const sampleTrips = [
      {
        id: "1",
        name: "Trip 1",
        date: "2024-07-01",
        time: "10:00",
        stops: ["Stop 1", "Stop 2"],
        destination: "Destination 1",
        departureTime: "09:00",
      },
      {
        id: "2",
        name: "Trip 2",
        date: "2024-07-02",
        time: "11:00",
        stops: ["Stop 3", "Stop 4"],
        destination: "Destination 2",
        departureTime: "10:00",
      },
    ];
    setTrips(sampleTrips);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTrip({ ...currentTrip, [name]: value });
  };

  const handleStopsChange = (stops) => {
    setCurrentTrip({ ...currentTrip, stops });
  };

  const handleAddTrip = () => {
    setTrips([...trips, { ...currentTrip, id: Date.now().toString() }]);
    setCurrentTrip({
      id: "",
      name: "",
      date: "",
      time: "",
      stops: [],
      destination: "",
      departureTime: "",
    });
    setShowModal(false);
  };

  const handleEditTrip = (id) => {
    const trip = trips.find((trip) => trip.id === id);
    setCurrentTrip(trip);
    setShowModal(true);
  };

  const handleUpdateTrip = () => {
    setTrips(
      trips.map((trip) => (trip.id === currentTrip.id ? currentTrip : trip))
    );
    setCurrentTrip({
      id: "",
      name: "",
      date: "",
      time: "",
      stops: [],
      destination: "",
      departureTime: "",
    });
    setShowModal(false);
  };

  const handleDeleteTrip = (id) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  const handleOpenModal = () => {
    setCurrentTrip({
      id: "",
      name: "",
      date: "",
      time: "",
      stops: [],
      destination: "",
      departureTime: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (currentTrip.id) {
      handleUpdateTrip();
    } else {
      handleAddTrip();
    }
  };

  // Filter trips based on search term and selected filters
  const filteredTrips = trips.filter(
    (trip) =>
      trip.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.length === 0 ||
        filters.some((filter) => trip.stops.includes(filter)))
  );

  const handleAddFilter = (filter) => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter]);
    }
  };

  const handleDeleteFilter = (filter) => {
    setFilters(filters.filter((f) => f !== filter));
  };
  console.log('trips:', trips);
  console.log('searchTerm:', searchTerm);
  console.log('filters:', filters);
  console.log('filteredTrips:', filteredTrips);

  return (
    <>
      <h1>Fleet Management Page</h1>
      <div className="container">
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={10} sm={9}>
            <TextField
              id="search"
              label="Search by Trip Name"
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
              Add Trip
            </Button>
          </Grid>
          {/* <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
          <IconButton
            aria-label="filter"
            onClick={handleOpenFilterModal}
          >
            <FilterListIcon />
          </IconButton>
        </Grid> */}
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
        <TripModal
          show={showModal}
          handleClose={handleCloseModal}
          trip={currentTrip}
          handleInputChange={handleInputChange}
          handleStopsChange={handleStopsChange}
          handleSubmit={handleSubmit}
        />
        <h2>Trip List</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trip Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Stops</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Departure Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell>{trip.name}</TableCell>
                <TableCell>{trip.date}</TableCell>
                <TableCell>{trip.time}</TableCell>
                <TableCell>{trip.stops.join(", ")}</TableCell>
                <TableCell>{trip.destination}</TableCell>
                <TableCell>{trip.departureTime}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEditTrip(trip.id)}>
                    <EditIcon />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDeleteTrip(trip.id)}
                  >
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

export default TripManagement;
