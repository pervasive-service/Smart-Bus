import React, { useState, useEffect } from "react";
import { Button, Table, TableHead, TableBody, TableRow, TableCell, TextField, Box, Grid, Chip } from '@mui/material';
import ScheduleModal from './ScheduleModal'; // Assuming you have a ScheduleModal component
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import "./ScheduleManagement.css"

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState({
    id: "",
    trips: [],
    scheduleDate: "",
    scheduleTime: "",
  });
  const [availableTrips, setAvailableTrips] = useState(['Trip 1', 'Trip 2', 'Trip 3', 'Trip 4']); // Replace with actual data
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Sample data, replace with API call if needed
    const sampleSchedules = [
      {
        id: "S329",
        trips: ["Trip 1", "Trip 2"],
        scheduleDate: "2024-07-01",
        scheduleTime: "10:00",
      },
      {
        id: "S330",
        trips: ["Trip 3"],
        scheduleDate: "2024-07-02",
        scheduleTime: "11:00",
      },
    ];
    setSchedules(sampleSchedules);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSchedule({ ...currentSchedule, [name]: value });
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, { ...currentSchedule, id: `S${schedules.length + 1}` }]);
    setCurrentSchedule({
      id: "",
      trips: [],
      scheduleDate: "",
      scheduleTime: "",
    });
    setShowModal(false);
  };

  const handleEditSchedule = (id) => {
    const schedule = schedules.find((schedule) => schedule.id === id);
    setCurrentSchedule(schedule);
    setShowModal(true);
  };

  const handleUpdateSchedule = () => {
    setSchedules(
      schedules.map((schedule) => (schedule.id === currentSchedule.id ? currentSchedule : schedule))
    );
    setCurrentSchedule({
      id: "",
      trips: [],
      scheduleDate: "",
      scheduleTime: "",
    });
    setShowModal(false);
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const handleOpenModal = () => {
    setCurrentSchedule({
      id: "",
      trips: [],
      scheduleDate: "",
      scheduleTime: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (currentSchedule.id) {
      handleUpdateSchedule();
    } else {
      handleAddSchedule();
    }
  };

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.length === 0 || filters.some((filter) => schedule.trips.some(trip => trip.toLowerCase().includes(filter.toLowerCase()))))
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
      <h1>Schedule Management Page</h1>
      <div className="container">
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={10} sm={9}>
            <TextField
              id="search"
              label="Search by Schedule ID"
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
              Add Schedule
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
        <ScheduleModal
          show={showModal}
          handleClose={handleCloseModal}
          schedule={currentSchedule}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          availableTrips={availableTrips}
        />
        <h2>Schedule List</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Schedule ID</TableCell>
              <TableCell>Trips</TableCell>
              <TableCell>Schedule Date</TableCell>
              <TableCell>Schedule Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.id}</TableCell>
                <TableCell>
                  {schedule.trips.map((trip) => (
                    <Chip key={trip} label={trip} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </TableCell>
                <TableCell>{schedule.scheduleDate}</TableCell>
                <TableCell>{schedule.scheduleTime}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEditSchedule(schedule.id)}>
                    <EditIcon />
                  </Button>
                  <Button size="small" onClick={() => handleDeleteSchedule(schedule.id)}>
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

export default ScheduleManagement;
