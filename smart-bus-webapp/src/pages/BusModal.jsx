import React from 'react';
import { TextField, Button, Chip, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import "./BusModal.css"; // Assuming you have a BusModal.css file for styling

const BusModal = ({ show, handleClose, bus, handleInputChange, handleStopsChange, handleSubmit }) => {
  if (!show) return null;

  const availableStops = ['Stop 1', 'Stop 2', 'Stop 3', 'Stop 4']; // Replace with your actual stops

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{bus.id ? 'Edit Bus' : 'Add Bus'}</h2> {/* Changed Trip to Bus */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <TextField
            label="Bus Name" // Changed Trip Name to Bus Name
            name="name"
            value={bus.name} // Changed trip to bus
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            type="date"
            name="date"
            value={bus.date} // Changed trip to bus
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Time"
            type="time"
            name="time"
            value={bus.time} // Changed trip to bus
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Destination"
            name="destination"
            value={bus.destination} // Changed trip to bus
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Departure Time"
            type="time"
            name="departureTime"
            value={bus.departureTime} // Changed trip to bus
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Autocomplete
            multiple
            options={availableStops}
            value={bus.stops} // Changed trip to bus
            onChange={(event, newValue) => handleStopsChange(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Stops"
                placeholder="Select stops"
                margin="normal"
                fullWidth
              />
            )}
          />
          <div className='btn-container'>
            <Button type="submit" variant="contained" color="primary">
              {bus.id ? 'Update Bus' : 'Add Bus'} {/* Changed Trip to Bus */}
            </Button>
            <Button type="button" onClick={handleClose} variant="outlined" color="secondary">
              <CloseIcon /> Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusModal;
