import { withRouter,Switch,Route } from "react-router-dom";
import React, {useState,useEffect} from 'react';
import clsx from 'clsx';
import { fade,makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import InputBase from '@material-ui/core/InputBase';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { patientOptions,doctorOptions,insuranceOptions,secondaryListItems, popoverMenu } from './navigationlist.component';
import MenuPopover from "./popover.component"
import Search from "./search.component"

import Profile from "./profile.component";
import Appointment from "./appointment.component"
import Stats from "./stats.component"
import SearchResult from "./searchresult.component"
import Insurance from "./insurance.component"
import {Billing} from './bill.component'
import {Report} from './report.component'

import {Chat} from './chat.component'

import { useCookies } from 'react-cookie';
import axios from 'axios';

// import { Switch } from "@material-ui/core";
// import Chart from './Chart';
// import Deposits from './Deposits';
// import Orders from './Orders';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    color:"#BCBABE",
    backgroundColor:"#003B46",
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    backgroundColor:"#003B46",
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [showPopover,setShowPopover]=useState(null);
  const [cookies, setCookie] = useCookies(['userName','userData','userProfile'])
  const [userName,setUserName]=useState(cookies["userName"])

  useEffect(() => {
    if(cookies["userName"]==undefined){
      props.history.push('/')
    }
    axios.post('/getUserInformarion', {"userName":cookies["userName"]})
      .then(res => 
          {
            setCookie('userData', res, { path: '/' })
            axios.post('/getProfileById', {"id":res['data']['id']})
            .then(res => 
                {
                    setCookie('userProfile',res['data'], { path: '/' })
                }).catch((error)=>{
                    console.log(error)
                })
          })
        .catch((error)=>{
            console.error(error)
        })
  }, [])

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handlePopover=(e)=>{
    setShowPopover(e.currentTarget)
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* Top bar */}
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Avatar src="/static/logo.webp" className={classes.avatar}>
          </Avatar>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            RoboMed
          </Typography>
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div> */}
          <Search></Search>
          <IconButton color="inherit" onClick={handlePopover}>
            <AccountCircleSharpIcon/>
            {/* <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge> */}
          </IconButton>
          {showPopover? <MenuPopover popoverContent={popoverMenu} 
          setShowPopover={setShowPopover} open={showPopover}/>:" "}
        </Toolbar>
      </AppBar>
      {/* Side Navigation bar */}
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }} 
          open={open}>
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon style={{color:'#BCBABE'}}/>
          </IconButton>
        </div>
        <Divider style={{backgroundColor:'#BCBABE'}}/>
        
        {cookies["userData"] && cookies["userData"]["data"]["role"]=="patient"?
        <List>{patientOptions}</List>
        :cookies["userData"] &&  cookies["userData"]["data"]["role"]=="doctor"? 
          <List>{doctorOptions}</List>
        : <List>{insuranceOptions}</List>
        }
        
        <Divider style={{backgroundColor:'#BCBABE'}}/>
        <List>{secondaryListItems}</List>
      </Drawer>
      {/* Main body */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer}/>
        <Switch>
        {cookies["userData"] && cookies["userData"]["data"]["role"]=="insuranceAgent"?
          <Route exact path="/dashboard" component={Stats} /> :
          <Route exact path="/dashboard" component={Appointment} /> 
        }
          <Route  path="/dashboard/profile" component={Profile} />
          <Route  path="/dashboard/search/:userId" component={SearchResult} />
          <Route  path="/dashboard/insurance" component={Insurance} />
          <Route  path="/dashboard/billing" component={Billing} />
          <Route  path="/dashboard/report" component={Report} />
          <Route  path="/dashboard/chat/:userId" component={Chat} />
        </Switch>
       
        {/* <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            Chart
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid>
            Recent Deposits
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>
            Recent Orders
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Orders />
              </Paper>
            </Grid>
          </Grid>
        </Container> */}
        {/* <Copyright /> */}

      </main>
    </div>
  );
}