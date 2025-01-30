import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AddEventForm = ({ onAddEvent }) => {
    const [newEvent, setNewEvent] = useState({
        day: '',
        time: '',
        description: '',
        image: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newEvent.day || !newEvent.time || !newEvent.description) {
            alert('Veuillez remplir tous les champs de l\'événement.');
            return;
        }
        onAddEvent(newEvent);
        setNewEvent({ day: '', time: '', description: '', image: '' });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
                label="Jour"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={newEvent.day}
                onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="Heure"
                type="time"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                fullWidth
                required
            />
            <TextField
                label="URL de l'image"
                variant="outlined"
                value={newEvent.image}
                onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                fullWidth
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<AddCircleOutlineIcon />}
                sx={{
                    flex: '1 1 100%',
                    borderRadius: 10,
                    backgroundColor: '#5a67d8',
                    '&:hover': { backgroundColor: '#434aa1' },
                }}
            >
                Ajouter l'événement
            </Button>
        </Box>
    );
};

export default AddEventForm;