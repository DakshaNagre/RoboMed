import React , {useState,useEffect}  from "react";
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import PositionedSnackbar from './snackbar.component';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ChatIcon from '@material-ui/icons/Chat';
import Divider from '@material-ui/core/Divider';
import InfoTile from "./infotile.component";
import Typography from '@material-ui/core/Typography';
import AppointmentDialog from "./createappointment.component";
import { useCookies } from 'react-cookie';

const useStyles = makeStyles(theme => ({
    fab: {
      margin: theme.spacing(1),
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    fab2: {
      margin: theme.spacing(1),
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(10),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }));

function FloatingActionButton(props) {
    const classes = useStyles();
    const [open,setOpen]=useState(false)
    const handleClickOpen = () => {
        setOpen(true);
      };
    return (
        <React.Fragment>
        <Fab variant="extended" color="primary" aria-label="add" onClick={handleClickOpen} className={classes.fab}>
          <AddIcon className={classes.extendedIcon}/>
          Schedule
        </Fab>
        { open ? <AppointmentDialog open={open} 
        handleAppointmentChange={props.handleAppointmentChange} userData={props.userData} setOpen={setOpen} /> : " "}
        
        {/* <Fab color="primary" aria-label="chat" className={classes.fab2}>
          <ChatIcon />
        </Fab> */}

        </React.Fragment>
    );
  }
export default function Appointment (props){
    const [snackbar,setSnackBar]=useState(false)
    const [errorMessage,setErrorMessage]=useState("")
    const [userData,setUserData]=useState({data:{}})
    const [cookies, setCookie] = useCookies(['userName','userData'])
    const [userName,setUserName]=useState("")
    const [appointments,setAppointments]=useState([])
    const [oldAppointments,setOldAppointments]=useState([])

    useEffect(() => {
      if(cookies["userName"]==undefined){
        props.history.push('/')
      }
      setUserName(cookies["userName"])
      
      axios.post('/getUserInformarion', {"userName":cookies["userName"]})
      .then(res => 
          {
            
            setCookie('userData', res, { path: '/' })
            setUserData(res)

            let data={
                'userId':res['data']['id'],
                'role':res['data']['role']
            }
            handleAppointmentChange(data)
          })
        .catch((error)=>{
            console.error(error)
        })

    }, [])

    const handleAppointmentChange=(data)=>{
      axios.post('/getAppointment',data).then((res)=>{
        console.log("Handle change called")
        let newAppointments=[]
        let previousAppointments=[]
        res['data'].forEach(element => {
          if(element['status']=='pending' || element['status']=='approved')
          {
            newAppointments.push(element)
          }else
          {
              previousAppointments.push(element)
          }  
        })
        console.log(newAppointments)
        setAppointments(newAppointments)
        setOldAppointments(previousAppointments)

    }).catch((err)=>{
        console.error(err)
    })
    }
    return (
        <React.Fragment>
        <CssBaseline />
        <Container component='main'>
        { snackbar ? <PositionedSnackbar open={snackbar} 
          message={errorMessage} 
          snackBar={setSnackBar}/> :<p></p> }
        { appointments.length==0 && oldAppointments.length==0 ? 
          <h3>{'No appointments for '+userName.split('@')[0]+' !'}</h3>
          : 
            <div>
            <Typography color="textSecondary">
                Appointments
            </Typography>
            <br/>
            <div className='row'>
            {appointments.map((appointment, i) => 
                <div key={appointment['_id']+'_'+appointment['status']} className='col-3'>
                    <InfoTile role={userData['data']['role']}  
                    data={appointment} handleAppointmentChange={handleAppointmentChange}/>
                    <br/>
                </div>)}
            </div>
            <Divider />
            <Typography color="textSecondary">
                History
            </Typography>
            <div className='row'>
            {oldAppointments.map((appointment, i) => 
                <div key={appointment['_id']+'_'+appointment['status']} className='col-3'>
                    <InfoTile role={userData['data']['role']}  
                    data={appointment} />
                    <br/>
                </div>)}
            </div>
            </div>

        }
        { 
        userData['data']['role']=='patient'?
        <FloatingActionButton userData={userData} handleAppointmentChange={handleAppointmentChange}/> : " "
        }
        </Container>
        </React.Fragment>

    )
}