import React from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import "./ScheduleModal.css";

const ScheduleModal = ({ show, handleClose, schedule, handleInputChange, handleSubmit, availableTrips }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{schedule.id ? 'Edit Schedule' : 'Add Schedule'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <TextField
            label="Schedule ID"
            name="id"
            value={schedule.id}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled
          />
          <Autocomplete
            multiple
            options={availableTrips}
            value={schedule.trips}
            onChange={(event, newValue) => handleInputChange({ target: { name: 'trips', value: newValue } })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Trips/Fleets"
                placeholder="Select trips/fleets"
                margin="normal"
                fullWidth
              />
            )}
          />
          <TextField
            label="Schedule Date"
            type="date"
            name="scheduleDate"
            value={schedule.scheduleDate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Schedule Time"
            type="time"
            name="scheduleTime"
            value={schedule.scheduleTime}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <div className='btn-container'>
            <Button type="submit" variant="contained" color="primary">
              {schedule.id ? 'Update Schedule' : 'Add Schedule'}
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

export default ScheduleModal;
