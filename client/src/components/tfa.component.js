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
import Container from '@material-ui/core/Container';
import { textAlign } from '@material-ui/system';
import { useCookies } from 'react-cookie';

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

function Tfa(props) {

    const classes = useStyles();
    const [token,setToken]=useState("");
    const [cookies, setCookie] = useCookies(['userName']);

    let onSubmit=(e)=>{
        e.preventDefault()
        console.log(token)
        let data=
          {
            "userName":props.location.state.userName,
            "code":token
          }
          axios.post('/tfa', data)
                .then(res => 
                  {
                    console.log(res.data)
                    if(props.location.state.hasOwnProperty('resetPassword'))
                    {
                        props.history.push('/forgotPassword',{valid:true,
                            userName:props.location.state.userName})
                    }else
                    {   
                        setCookie('userName', props.location.state.userName, { path: '/' })
                        props.history.push('/dashboard',{userName:props.location.state.userName})
                    }
                  }).catch((err)=>{
                      console.error(err)
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

            {props.location.state.data != undefined ?
            <div style={{textAlign:'center'}}>
                <Typography component="h1" variant="h5">
                Authentication         
                </Typography>
                <img src={props.location.state.data} style={{flexShrink: '0',
                minWidth: '25%',
                minHeight: '25%'
                }} ></img>
            </div> :
            <Typography component="h1" variant="h5">
                Authentication       
            </Typography>
            }
            <form className={classes.form} noValidate 
              onSubmit={onSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Token"
                label="Token"
                type="password"
                id="token"
                value={token}
                onChange={e => setToken(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Validate
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <A href="#" variant="body2">
                    Forgot password?
                  </A>
                </Grid>
                <Grid item>
                  <A to='/register' variant="body2">
                    {"Don't have an account? Sign Up"}
                  </A>
                </Grid>
              </Grid> */}
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

export default withRouter(Tfa)