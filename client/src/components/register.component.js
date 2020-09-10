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
import PositionedSnackbar from './snackbar.component';

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
      margin: 10,
      width: 60,
      height: 60,
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

function Register(props){
    const classes = useStyles();

    const [snackbar,setSnackBar]=useState(false)
    const [errorMessage,setErrorMessage]=useState("")

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [cpassword,setCpassword]=useState("");
    const [fname,setFname]=useState("")
    const [lname,setLname]=useState("")
    const [mobile,setMobile]=useState("")
    const [values,setValues]=useState({role:'',name:'none'})

    const handleChange = event => {
        setValues(oldValues => ({
          ...oldValues,
          [event.target.name]: event.target.value,
        }));
      };
    let onSubmit=(e)=>{
        e.preventDefault()
        console.log(email+' '+password+' '+cpassword+' '+fname+' '+lname+' '+values.role+' '+mobile)
        let data=
            {
            "email":email,
            "password":password,
            "firstName":fname,
            "lastName":lname,
            "role":values.role,
            "mobile":mobile
            }
            axios.post('/registerUser', data)
                .then(res => 
                    { 
                    console.log(res.data)
                    axios.post('/tfaSetup', {'userName':email})
                      .then(res => {
                        props.history.push('/tfa',{'userName':email,data:res['data']})
                      })
                    }).catch((error)=>{
                        console.log(error)
                        setErrorMessage("Registration failed. Email exists!")
                        setSnackBar(true)
                    })
    }
    return (
        <React.Fragment>
        <CssBaseline />
        <Container component='main' style={{
                 backgroundImage: 'url(/static/home.png)',
                 backgroundRepeat: 'no-repeat',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 height:'105vh',
                 }}>
        { snackbar ? <PositionedSnackbar open={snackbar} 
          message={errorMessage} 
          snackBar={setSnackBar}/> :<p></p> }
        <div className='row'>
               <div className='col-4'>
               </div>
               <div className='col-4'>
        <Card style={{ padding:'1em' }} 
            className={classes.paper}>
            <Avatar src="/static/logo.webp" className={classes.avatar}>
            </Avatar>
            <Typography component="h1" variant="h5">
            Register
            </Typography>
            <form className={classes.form} noValidate onSubmit={onSubmit}>
              <div className="row">
                <div className="col-6">
                  <TextField variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="fname"
                  label="First Name"
                  name="fname"
                  // autoComplete="email"
                  // autoFocus
                  value={fname}
                  onChange={e => setFname(e.target.value)}
                />
                </div>
                <div className="col-6">
                  <TextField variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="lname"
                  label="Last Name"
                  name="lname"
                  // autoComplete="email"
                  // autoFocus
                  value={lname}
                  onChange={e => setLname(e.target.value)}
                />
                </div>
                </div>
                <TextField variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
                <div className='row'>
              <div className='col-6'>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                // autoComplete="current-password"
              />
              </div>
              <div className='col-6'>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Repeat password"
                label="Repeat Password"
                type="password"
                id="cpassword"
                value={cpassword}
                onChange={e => setCpassword(e.target.value)}
                // autoComplete="current-password"
              />
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
              {/* <FormControl className={classes.formControl}> */}
                <InputLabel htmlFor="role-simple">Role</InputLabel>
                <Select style={{width : '100%' }} value={values.role} onChange={handleChange}
                    inputProps={{
                    name: 'role',
                    id: 'role-simple',
                    }}>
                    <MenuItem value={'patient'}>Patient</MenuItem>
                    <MenuItem value={'doctor'}>Doctor</MenuItem>
                    <MenuItem value={'insuranceAgent'}>Insurance agent</MenuItem>
                </Select>
            {/* </FormControl> */}
              </div>
              <div className='col-6'>            
            {/* <FormControl className={classes.formControl}> */}
            <TextField 
            variant="outlined"
                margin="normal"
                required
                fullWidth
                id="mobile"
                label="Mobile"
                name="mobile"
                // autoComplete="email"
                // autoFocus
                value={mobile}
                onChange={e => setMobile(e.target.value)}
              />
            {/* </FormControl> */}
            </div>
            </div>
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
            </form>
          {/* <Box mt={8}>
            <Copyright />
          </Box> */}
        </Card>
        </div>
        <div className='col-4'>      
        </div>
        </div>
        </Container>
        </React.Fragment>
      );
}

export default Register