import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker, } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import 'date-fns';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
export default function AppointmentDialog(props) {
  const [open, setOpen] = React.useState(props.open);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [description,setDescription]=React.useState("")
  const [doctors,setDoctors]=React.useState([])
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(['userName','userData'])

  const [values, setValues] = React.useState({
    dID: '',
    name: 'none',
  });

//   const inputLabel = React.useRef(null);
//   const [labelWidth, setLabelWidth] = React.useState(0);
//   React.useEffect(() => {
//     setLabelWidth(inputLabel.current.offsetWidth);
//   }, []);

  const handleChange = event => {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }))
  }

    useEffect(() => {
        axios.post('/getUsersByRole', {"role":"doctor"})
        .then(res => {
            setDoctors(res['data'])
        }).catch((error)=>{
            console.log(error)
        })
    },[])

  const handleDateChange = date => {
    setSelectedDate(date);
  };
  const handleClose = () => {
    setOpen(false);
    props.setOpen(false)
  };

  const handleCreate=()=>{
    let data={
        "userId":props.userData["data"]['id'],
        "docId":values['dID'],
        "dateTime":selectedDate,
        "description":description
      }
      axios.post('/createAppointment',data)
      .then((res)=>{
        let data={
          'userId':cookies['userData']['data']['id'],
          'role':cookies['userData']['data']['role']
      }
        props.handleAppointmentChange(data)
        console.log(res)
       }).catch((error)=>{
        console.error(error)
      })
      setOpen(false)
      props.setOpen(false)
  }
  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Book Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select doctor and appointment date.
          </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                fullWidth
            />
            <FormControl className={classes.formControl}>
                <InputLabel>Doctor</InputLabel>
                <Select
                value={values.dID}
                onChange={handleChange}
                inputProps={{
                    name: 'dID',
                    id: 'dID-simple',
                }}>
                {doctors.map((doctor, i) =>
                <MenuItem key={i} value={doctor['id']}>
                       Dr. {doctor.firstName} {doctor.lastName}
                    </MenuItem>)}
                </Select>
            </FormControl>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
                <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date picker inline"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                />
                <KeyboardTimePicker
                margin="normal"
                variant="inline"
                id="time-picker"
                label="Time picker"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change time',
                }}
                />
            </Grid>
            </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
