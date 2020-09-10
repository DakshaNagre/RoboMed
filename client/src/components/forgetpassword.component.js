import React,{useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import axios from 'axios';
import { withRouter,Link as A } from "react-router-dom";
import { BrowserRouter, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';


// import { useRedirect } from "hookrouter";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">RoboMed Inc</Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
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
}));

function ForgetPassword(props) {
  
  const classes = useStyles();
  const [password,setPassword]=useState("");
  const [confirmpassword,setConfirmPassword]=useState("");
  const [email,setEmail]=useState("");
  const [cookies, setCookie] = useCookies(['userName']);

  let onSubmit=(e)=>{
    e.preventDefault()
    console.log('New password is  '+password)
    if(props.location.state.valid){
      let data=
      {
        "userName":props.location.state.userName,
        "password":password,       
      }
      axios.post('/updatePassword', data) //need to check
            .then(res => 
              {
                console.log(res.data)
                setCookie('userName', props.location.state.userName, { path: '/' })
                props.history.push('/dashboard',{userName:props.location.state.userName})
              })
    }else
      {
        props.history.push('/tfa',{userName:email,resetPassword:true})
      }

    }
  return (
    <React.Fragment>
    <CssBaseline />
    <Container component='main' style={{
                 backgroundImage: 'url(/static/home.png)',
                 backgroundRepeat: 'no-repeat',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 height:'100vh',
                 }}>
    <div className='row'>
    <div className='col-4'>
    </div>
    <div className='col-4'>
    <Card style={{ padding:'1em' }} 
        className={classes.paper}>
        <Avatar src="/static/logo.webp" className={classes.avatar}>
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} noValidate 
          onSubmit={onSubmit}> 
          { !props.location.state.valid ? 
          <TextField variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          /> :
          <div>
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
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmpassword"
            label="Confirm Password"
            type="password"
            id="confirmpassword"
            value={confirmpassword}
            onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          }

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.reset}
          >
           {props.location.state.valid? "Reset" : "Proceed" }
          </Button>
        </form>
    </Card>
    </div>
    <div className='col-4'>      
    </div>
    </div>
    </Container>
    </React.Fragment>
  );
}

export default withRouter(ForgetPassword)