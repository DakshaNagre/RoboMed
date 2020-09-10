import React,{ useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

export default function PositionedSnackbar(props) {
    const [state, setState] = React.useState({
      open: props.open,
      vertical: 'bottom',
      horizontal: 'center',
    });
  
    const { vertical, horizontal, open } = state;
    const [text,setText]=useState(props.message)
    // const handleClick = newState => () => {
    //   setState({ open: true, ...newState });
    // };

    // useEffect(() => {
    //     setState({ open: true, vertical: 'bottom', horizontal: 'center' });
    // })
  
    const handleClose = () => {
      setState({ ...state, open: false });
      props.snackBar(false)
    };
  
    return (
      <div>
        {/* <Button onClick={handleClick({ vertical: 'top', horizontal: 'center' })}>Top-Center</Button>
        <Button onClick={handleClick({ vertical: 'top', horizontal: 'right' })}>Top-Right</Button>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })}>
          Bottom-Right
        </Button> */}
        {/* <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'center' })}>
          Bottom-Center
        </Button> */}
        {/* <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'left' })}>Bottom-Left</Button>
        <Button onClick={handleClick({ vertical: 'top', horizontal: 'left' })}>Top-Left</Button> */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          onClose={handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{text}</span>}
        />
      </div>
    );
  }