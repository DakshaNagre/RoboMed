import React,{useState,useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SignIn from './signin.component'
import { withRouter } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

function Home(props){
  const [cookies, setCookie] = useCookies(['userName']);

    useEffect(() => {
      if(cookies["userName"]!=undefined){
        props.history.push('/dashboard',{userName:cookies["userName"]})
      }
    },[])
    return( 
        <React.Fragment>
           <CssBaseline />
           <Container style={{
                 backgroundImage: 'url(/static/home.png)',
                 backgroundRepeat: 'no-repeat',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 height:'100vh',
                 }}>
             <div className='row'>
               <div className='col-8' style={{ marginTop:'25vh'}}>
               <Typography gutterBottom color="primary" align="center" style={{fontSize:'150px',
              fontWeight:'bold', textShadow:'2px 2px 8px #000'}}>
                RoboMed
                <Typography color="textSecondary" align="inherit" variant="h4" component="h1">
                  Droid Medical Care Simplified
                </Typography>
                </Typography>

               </div>
               {/* <div className='col-4'></div> */}
               <div className='col-4'>       
                 <SignIn></SignIn>
               </div>
             </div>
           </Container>
          </React.Fragment>
         );
}

export default withRouter(Home)