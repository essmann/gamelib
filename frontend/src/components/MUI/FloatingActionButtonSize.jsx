import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function FloatingActionButtonSize({onClick}) {
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab size="small" color="" aria-label="add" onClick={onClick}>
        <AddIcon />
      </Fab>
      
    </Box>
  );
}
