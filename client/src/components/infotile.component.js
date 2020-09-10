import React,{useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {CreateReport} from './report.component'

const useStyles = makeStyles(theme => ({
  card: {
    minWidth:180,
    maxWidth: 300,
  },
  media: {
    height: 50,
  },
  pos: {
    marginBottom: 12,
  },
  margin: {
    margin: theme.spacing(2),
  },
}));

export default function InfoTile(props) {
  const classes = useStyles();
  const [appointmentData,setAppointmentData]=useState(props.data)
  const [cookies, setCookie] = useCookies(['userName','userData'])

  const handleApprove=()=>{
    axios.post('/approveAppointment', 
    {"id":appointmentData._id})
    .then(res => {
      // appointmentData["status"]="approved"
      // let newData=appointmentData
      // setAppointmentData(newData)
      let data={
        'userId':cookies['userData']['data']['id'],
        'role':cookies['userData']['data']['role']
    }
      props.handleAppointmentChange(data)

    }).catch((error)=>{
        console.log(error)
    })
  }

const handleCancel=()=>{
  axios.post('/cancelAppointment', 
    {"id":appointmentData._id})
    .then(res => {
      // appointmentData["status"]="canceled"
      // let newData=appointmentData
      // setAppointmentData(newData)
      let data={
        'userId':cookies['userData']['data']['id'],
        'role':cookies['userData']['data']['role']
    }
      props.handleAppointmentChange(data)

    }).catch((error)=>{
        console.log(error)
    })
}

  return (
    <Badge color="secondary" invisible={appointmentData.status!="pending"} 
    badgeContent={'P'} className={classes.margin}>
    <Card style={{backgroundColor:"#fbfaff"}} className={classes.card}>
      <CardActionArea onClick={()=>{console.log("Hi")}}>
        {/* <CardMedia
          className={classes.media}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        /> */}
        <CardContent>
          <Typography color="primary" gutterBottom variant="h5" component="h2">
            {appointmentData._id}
          </Typography>
          <Typography style={{color:"#8eba43"}} className={classes.pos}>
          {new Date(appointmentData.dateTime).toLocaleString()}
        </Typography>
          <Typography variant="body2" color="" component="p">
          {appointmentData.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      {appointmentData['status']=='pending' || appointmentData['status']=='approved'? 
      <CardActions>
        <Button size="small" onClick={handleCancel} color="primary">
          Cancel
        </Button>
        {
          props.role=="doctor" && appointmentData['status']!='approved'?
        <Button size="small" onClick={handleApprove} color="primary">
          Approve
        </Button>:        
          props.role=="doctor" && 
        <CreateReport id={appointmentData._id} 
        patient={appointmentData.patient}
        doctor={appointmentData.doctor} />
        }
      </CardActions>
      : ""}
    </Card>
    </Badge>
  );
}