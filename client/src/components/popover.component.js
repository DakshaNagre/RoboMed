import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { List } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(1),
  },
}));

export default function MenuPopover(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(props.open);

//   const handleClick = event => {
//     setAnchorEl(event.currentTarget);
//   };

  const handleClose = () => {
    setAnchorEl(null);
    props.setShowPopover(null)
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
            {props.popoverContent}
        </List>
        {/* <Typography className={classes.typography}>

       </Typography> */}
      </Popover>
    </div>
  );
}