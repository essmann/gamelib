import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

export default function CheckboxListSecondary({ lists, textStyle, bgStyle }) {
  const [checked, setChecked] = React.useState([]);

  const handleToggle = (id) => () => {
    const currentIndex = checked.indexOf(id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {lists.map((list) => {
        const labelId = `checkbox-list-secondary-label-${list.id}`;
        return (
          <ListItem
            key={list.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(list.id)}
                checked={checked.includes(list.id)}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton sx={{ ...bgStyle }}>
              <ListItemText
                id={labelId}
                primary={list.name}
                sx={{ color: 'black', ...textStyle }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
