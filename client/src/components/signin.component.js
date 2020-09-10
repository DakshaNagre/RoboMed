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
import axios from 'axios';
import { withRouter,Link as A } from "react-router-dom";
import { BrowserRouter, Route } from 'react-router-dom';
import PositionedSnackbar from "./snackbar.component.js"
import { ReCaptcha } from 'react-recaptcha-google'

// import { connect } from "react-redux";
// import {setUser} from "../modules/action";

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

function SignIn(props) {
  const classes = useStyles();

  const [snackbar,setSnackBar]=useState(false)
  const [errorMessage,setErrorMessage]=useState("")

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [login,setLogin]=useState(false)
  const [loginAtempt,setLoginAtempt]=useState(0)

  let onSubmit=(e)=>{
    e.preventDefault()
    console.log(email+' '+password)
    let data=
      {
        "userName":email,
        "password":password
      }
      axios.post('/validateUser', data)
            .then(res => 
              {
                console.log(res.data)
                props.history.push('/tfa',{userName:email})
              }).catch((err)=>{
                  console.log(err)
                  setErrorMessage("Invalid Password!")
                  setSnackBar(true)
                  setLoginAtempt(loginAtempt+1)
              })
    }
   let verifyCallback=(recaptchaToken)=>{
      console.log(recaptchaToken)
      axios.post('/captcha',{'g-recaptcha-response':recaptchaToken})
      .then(res => 
      {
      console.log(res.data)
      setLoginAtempt(0)
      })
    }
  return (        
  <React.Fragment>
    { snackbar ? <PositionedSnackbar open={snackbar} 
    message={errorMessage} 
    snackBar={setSnackBar}/> :<p></p> }
    <Card style={{ padding:'1em' }} 
        className={classes.paper}>
        <Avatar src="/static/logo.webp" className={classes.avatar}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome
        </Typography>
        <form className={classes.form} noValidate 
          onSubmit={onSubmit}>
          <TextField
            variant="outlined"
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
          />
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
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          {
          loginAtempt==3? 
          <ReCaptcha
            // ref={(el) => {console.log(el)}}
            size="normal"
            render="explicit"
            sitekey="6Lfpxr0UAAAAALSDMLRJx8IBc2EMq5tdeoYAgKFs"
            // onloadCallback={}
            verifyCallback={verifyCallback}
          /> : 
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        }
          <Grid container>
            <Grid item xs>
              <A to={{pathname:'/forgotPassword',state:{valid:false}}} variant="body2">
                Forgot password?
              </A>
            </Grid>
            <Grid item>
              <A to='/register' variant="body2">
                {"Don't have an account? Sign Up"}
              </A>
            </Grid>
          </Grid>
        </form>
        {/* <form onSubmit={onSubmitCaptcha}>
        <div className="g-recaptcha" data-sitekey="6Lfpxr0UAAAAALSDMLRJx8IBc2EMq5tdeoYAgKFs">
        </div>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form> */}
        {/* <ReCaptcha
            // ref={(el) => {console.log(el)}}
            size="normal"
            render="explicit"
            sitekey="6Lfpxr0UAAAAALSDMLRJx8IBc2EMq5tdeoYAgKFs"
            // onloadCallback={}
            verifyCallback={verifyCallback}
        /> */}
      <Box mt={8}>
        <Copyright />
      </Box>
    </Card>
  </React.Fragment>
  );
}
// const mapStateToProps = state => {
//   const users = state.userDataReducer;
//   return {users};
// }
// export default connect(mapStateToProps, {setUser})(SignIn) 
export default withRouter(SignIn)