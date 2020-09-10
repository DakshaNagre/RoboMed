import React,{useEffect} from 'react';
import {useRoutes} from 'hookrouter';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Routes from "./route";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { loadReCaptcha } from 'react-recaptcha-google'

const theme = createMuiTheme({
  palette: {
    primary: {
        main: '#336B87'
      },
      secondary: {
        main: '#f44336',
      },
    }
  },
)

function App(){
  useEffect(() => {
    loadReCaptcha()
  });
  return(
    <MuiThemeProvider theme={theme}>
      <Routes/>
    </MuiThemeProvider>
  )
}



export default App;
