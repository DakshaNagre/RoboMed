import React,{useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import { BrowserRouter, Route } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(5),
      marginBottom:theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },  
    formControl: {
        margin: theme.spacing(1),
        minWidth: 50,
      },
  }));

function UserDetails(props){
    const classes = useStyles();
    const [qualification,setQualification]=useState("");
    const [specialization,setSpecialization]=useState("");
    const [experience,setExperience]=useState("");
    const [rating,setRating]=useState("");
    const [liscense,setLiscense]=useState("");
    const [age,setAge]=useState("");
    const [manufacturer,setManufacturer]=useState("");
    const [insuranceid,setInsuranceid]=useState("");
    const [ram,setRam]=useState("");
    const [harddisk,setHarddisk]=useState("");

    const [insurancename,setInsurancename]=useState("");
    const [designation,setDesignation]=useState("");
    const [ratings,setRatings]=useState("");
    const [values,setValues]=useState({role:'',name:'none'})

    const handleChange = event => {
        setValues(oldValues => ({
          ...oldValues,
          [event.target.name]: event.target.value,
        }));
      };

      /* if role == Doctor
    let onSubmit=(e)=>{
        e.preventDefault()
        console.log(qualification+' '+specialization+' '+experience+' '+rating+' '+lname+' '+liscense+')
        let data=
            {
            "qualification":qualification,
            "specialization":specialization,
            "experience":experience,
            "rating":rating,
            "liscense":liscense
            }
            axios.post('http://localhost:4000/registerUser', data)
                .then(res => 
                    {
                    console.log(res.data)
                    props.history.push('/dashboard')
                    }).catch((error)=>{
                        console.log(error)
                    })
    }
    */  

    
      /* if role == Patient
    let onSubmit=(e)=>{
        e.preventDefault()
        console.log(age+' '+manufacturer+' '+insuranceid+' '+ram+' '+harddisk)
        let data=
            {
            "age":age,
            "manufacturer":manufacturer,
            "insuranceid":insuranceid,
            "ram":ram,
            "harddisk":harddisk
            }
            axios.post('http://localhost:4000/registerUser', data)
                .then(res => 
                    {
                    console.log(res.data)
                    props.history.push('/dashboard')
                    }).catch((error)=>{
                        console.log(error)
                    })
    }
    */  
     /* if role == Insurance Agent
    let onSubmit=(e)=>{
        e.preventDefault()
        console.log(insurancename+' '+designation+' '+' '+ratings)
        let data=
            {
            "insurancename":insurancename,
            "designation":designation,
            "ratings":ratings
            }
            axios.post('http://localhost:4000/registerUser', data)
                .then(res => 
                    {
                    console.log(res.data)
                    props.history.push('/dashboard')
                    }).catch((error)=>{
                        console.log(error)
                    })
    }
    */  

    return (
        <React.Fragment>
        <CssBaseline />
        <Container component='main'>
        {/* <div className='row'>
               <div className='col-4'>
               </div>
               <div className='col-4'> */}
        <Card style={{ padding:'1em' }} 
            className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            UserDetails
            </Typography>
            <form className={classes.form} noValidate>
           
            {/* /* Role == Doctor */}
            <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="qualification"
                label="Qualification"
                name="qualification"
                // autoComplete="email"
                // autoFocus
                value={qualification}
                onChange={e => setQualification(e.target.value)}
              />
            <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="specialization"
                label="Specialization"
                name="specialization"
                // autoComplete="email"
                // autoFocus
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
              />
            <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="experience"
                label="Experience"
                name="experience"
                //autoComplete="email"
                //autoFocus
                value={experience}
                onChange={e => setExperience(e.target.value)}
              />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="rating"
                label="Rating"
                type="rating"
                id="rating"
                value={rating}
                onChange={e => setRating(e.target.value)}
                // autoComplete="current-password"
              />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="liscense"
                label="Liscense"
                type="liscense"
                id="liscense"
                value={liscense}
                onChange={e => setLiscense(e.target.value)}
                // autoComplete="current-password"
              />
            {/* */

            /* Role == Patient */}
            <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="age"
                label="Age"
                name="age"
                // autoComplete="email"
                // autoFocus
                value={age}
                onChange={e => setAge(e.target.value)}
              />
            <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="manufacturer"
                label="Manufacturer"
                name="manufacturer"
                // autoComplete="email"
                // autoFocus
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
              />
            <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="insuranceid"
                label="Insurance Id"
                name="insuranceid"
                //autoComplete="email"
                //autoFocus
                value={insuranceid}
                onChange={e => setExperience(e.target.value)}
              />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="ram"
                label="Ram"
                type="ram"
                id="ram"
                value={rating}
                onChange={e => setRam(e.target.value)}
                // autoComplete="current-password"
              />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="harddisk"
                label="Hard Disk"
                type="harddisk"
                id="harddisk"
                value={harddisk}
                onChange={e => setHarddisk(e.target.value)}
                // autoComplete="current-password"
              />
            {/* */

            /* Role == Insurance Agent */}
            <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="insurancename"
                label="Insurance Name"
                name="insurancename"
                // autoComplete="email"
                // autoFocus
                value={insurancename}
                onChange={e => setInsurancename(e.target.value)}
              />
            <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="designation"
                label="Designation"
                name="designation"
                // autoComplete="email"
                // autoFocus
                value={designation}
                onChange={e => setDesignation(e.target.value)}
              />
            <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="ratings"
                label="Ratings"
                name="ratings"
                //autoComplete="email"
                //autoFocus
                value={ratings}
                onChange={e => setRatings(e.target.value)}
              />
             <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit
              </Button>                
            </form>
          {/* <Box mt={8}>
            <Copyright />
          </Box> */}
        </Card>
        {/* </div>
        <div className='col-4'>      
        </div>
        </div> */}
        </Container>
        </React.Fragment>
      );
}

export default UserDetails