import React,{useState,useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import {DocProfile,PatientProfile,InsuranceProfile} from './profile.component'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';

import axios from 'axios';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles(theme => ({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(5),
      marginBottom:theme.spacing(3),
      display: 'block',
      flexDirection: 'column',
      alignItems: 'center',
    //   minWidth:180,
    //   maxWidth: 300,
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
    media: {
      height: 150,
    },  
    formControl: {
        margin: theme.spacing(1),
        minWidth: 50,
      },  
      card: {
        minWidth:180,
        maxWidth: 300,
      },
      pos: {
        marginBottom: 12,
      },
      margin: {
        margin: theme.spacing(2),
      },
  }));

export default function Insurance (props){    

    const classes = useStyles();

    const [cookies, setCookie] = useCookies(['userName','userData','userProfile']);
    const [insuranceData,setInsuranceData]=useState({})
    
    useEffect(() => {
        axios.post('/getProfileById', {"id":cookies['userProfile']['insuranceId']})
        .then(res => 
            {
                setInsuranceData(res['data'])
                console.log(res['data'])
            }).catch((error)=>{
                console.log(error)
            })
    },[cookies['userProfile']])

    return (
        <React.Fragment>
        <CssBaseline />
        <Container component='main'>
            {insuranceData?
            <div className="row">
                <div className='col-4'>
                    <InsuranceTile mode="selected" insuranceData={insuranceData}/>
                </div>
                <div className='col-4'>
                <CoverageTile insuranceData={insuranceData}/>
                </div>
                </div>
                :
                <Typography className={classes.paper} 
                        gutterBottom color="textSecondary" variant="h4" component="h2">
                    No insurance plan? Hit purchase!
                    <FindPlan/>
                    </Typography>
                    
                    }
            
        </Container>
        </React.Fragment>
        )
}

export function InsuranceTile(props){
    const classes = useStyles();
    const [cookies, setCookie] = useCookies(['userName','userData','userProfile']);

    const handleSelect=()=>{
        axios.post('/setInsuranceProvider', {"insurance":props.insuranceData['_id'],
        "id":cookies["userProfile"]["_id"]})
        .then(res => 
            {
                console.log(res['data'])
                axios.post('/getProfileById', {"id":cookies["userProfile"]["_id"]})
                .then(res => 
                    {
                        setCookie('userProfile',res['data'], { path: '/' })
                        let data={
                          price:props.price,
                          patient:cookies["userProfile"]["_id"],
                          insuranceAgent:props.insuranceData['_id'],
                          status:"due",
                          date:new Date()
                          }

                        axios.post('/createInsuranceBill',data).then((res)=>{
                          console.log("done")
                        }).catch((error)=>{
                          console.log(error)
                        })


                    }).catch((error)=>{
                        console.log(error)
                    })
            }).catch((error)=>{
                console.log(error)
        })
    }
    const handleCancel=()=>{
        axios.post('/setInsuranceProvider', {"insurance":"",
        "id":cookies["userProfile"]["_id"]})
        .then(res => 
            {
            axios.post('/getProfileById', {"id":cookies["userProfile"]["_id"]})
            .then(res => 
                {
                    setCookie('userProfile',res['data'], { path: '/' })
                }).catch((error)=>{
                    console.log(error)
                })
            }).catch((error)=>{
                console.log(error)
        })
    }
    return (
        <Card style={{backgroundColor:"#fbfaff"}} className={classes.paper}>
        <CardActionArea onClick={()=>{console.log("Hi")}}>
          <CardMedia
            className={classes.media}
            image={props.insuranceData['picture']}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {props.insuranceData['insuranceName']}
            </Typography>
            {props.mode=='select'?
            <Typography className={classes.pos} color="secondary">
            {'$ '+parseFloat(props.price).toFixed(2)+' /month'}
            </Typography>            
            :""}
            <Typography variant="body2" color="textSecondary" component="p">
            {props.insuranceData['description']}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
        {props.mode=='selected'?
        <Button size="small" onClick={handleCancel} color="primary">
          Cancel
        </Button>
        :
        <Button size="small" onClick={handleSelect} color="primary">
          Select
        </Button>
        }
        </CardActions>
      </Card>
        )
}

export function CoverageTile(props){
    const classes = useStyles();
    const [cookies, setCookie] = useCookies(['userName','userData','userProfile']);
    return (
        <React.Fragment>
        <Card style={{backgroundColor:"#fbfaff"}} className={classes.paper}>
        <Grid container justify="center" alignItems="center">
            <Avatar className={classes.avatar}>
                <LocalAtmIcon />
            </Avatar>
        </Grid>
        {/* <CardActionArea onClick={()=>{console.log("Hi")}}> */}
          {/* <CardMedia
            className={classes.media}
            image={props.insuranceData['picture']}
          /> */}
          <CardContent>
            <Typography gutterBottom variant="h5">
                Your coverage plan
            </Typography>
            {/* <Typography className={classes.pos} color="textSecondary">
            {new Date(appointmentData.dateTime).toLocaleDateString()}
          </Typography> */}
          <div className='row'>
              <div className='col-6'>
                <Typography color="textSecondary">
                CPU
                </Typography>
                <Typography color="textPrimary">
                {"  $"+cookies["userProfile"]['cpuCoverage']}
                </Typography>
              </div>
              <div className='col-6'>
              <Typography color="textSecondary" >
            Hard Drive
            </Typography>    
            <Typography >
            {"  $"+cookies["userProfile"]["hardDriveCoverage"]}
            </Typography>
              </div>
              <div className='col-6'>
                <Typography color="textSecondary" >
                Cosmetics
                </Typography>    
                <Typography >
                {"  $"+cookies["userProfile"]['cosmeticsCoverage']}
                </Typography>  
              </div>
              <div className='col-6'>
                <Typography color="textSecondary" >
                Software 
                </Typography>    
                <Typography >
                {"  $"+cookies["userProfile"]['softwareCoverage']}
                </Typography>  
              </div>
              <div className='col-6'>
                <Typography color="textSecondary" >
                Sensors
                </Typography>    
                <Typography >
                {"  $"+cookies["userProfile"]['sensorsCoverage']}
                </Typography>     
                </div>
              <div className='col-6'>
                <Typography color="textSecondary" >
                Motors
                </Typography>    
                <Typography >
                {"  $"+cookies["userProfile"]['motorsCoverage']}
                </Typography>  
                </div>
             </div>     
            {/* <Typography color="textSecondary" >
            Deductible
            </Typography>    
            <Typography >
            {"  $"+cookies["userProfile"]['deductibleClaim']}
            </Typography> */}
            </CardContent>
        {/* </CardActionArea> */}
        {/* <CardActions>
        <Button size="small" color="primary">
          Edit
        </Button>
        <Button size="small" color="primary">
          Cancel
        </Button>
        </CardActions> */}
      </Card>
      </React.Fragment>
        )
}

export function FindPlan(props){

    const [cookies, setCookie] = useCookies(['userName','userData','userProfile']);
    const [open, setOpen] = React.useState(false);
    const [cpuCoverage,setCpuCoverage]=useState("");
    const [hardDriveCoverage,setHardDriveCoverage]=useState("");
    const [softwareCoverage,setSoftwareCoverage]=useState("");
    const [cosmeticsCoverage,setCosmeticsCoverage]=useState("");
    const [sensorsCoverage,setSensorsCoverage]=useState("");
    const [motorsCoverage,setMotorsCoverage]=useState("");
    const [deductibleClaim,setDeductibleClaim]=useState("");
    const [insurancePlans,setInsurancePlans]=useState([]);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  const handleSubmit=()=>{
    
    let data={
        ...cookies['userProfile'],
        "cpuCoverage":cpuCoverage,
        "hardDriveCoverage":hardDriveCoverage,
        "softwareCoverage":softwareCoverage,
        "cosmeticsCoverage":cosmeticsCoverage,
        "sensorsCoverage":sensorsCoverage,
        "motorsCoverage":motorsCoverage,
        "deductibleClaim":deductibleClaim
    }
    axios.post('/updateProfileById', data)
    .then(res =>{
            console.log(res['data'])
            setOpen(false);
            // setReviews(res['data'])
        }).catch((error)=>{
            console.log(error)
        })
    axios.post('/getPlans', 
    {
    "cpuCoverage":cpuCoverage,
    "hardDriveCoverage":hardDriveCoverage,
    "softwareCoverage":softwareCoverage,
    "cosmeticsCoverage":cosmeticsCoverage,
    "sensorsCoverage":sensorsCoverage,
    "motorsCoverage":motorsCoverage,
    "deductibleClaim":deductibleClaim
    })
    .then((res)=>{
        console.log(res['data'])
        setInsurancePlans(res['data'])
    }).catch((error)=>{
        console.log(error)
    })
  }
  
    return (
      <div>
        <Button size="small" color="primary" color="primary" onClick={handleClickOpen}>
        Purchase
        </Button>
        <br/>
        {insurancePlans.length!=0?
            <div>
            <Divider/>
            <Typography color="textSecondary">
                Recommendations
            </Typography>
            </div>:""}
        <div className='row'>
            {insurancePlans.map((plan, i) => 
                <div key={plan[1]['_id']} className='col-3'>
                    <InsuranceTile mode="select" price={plan[0]} insuranceData={plan[1]}/>
                    <br/>
                </div>)}
            </div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Coverage amount</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Provide the amount in $ you wish to be covered!
            </DialogContentText>
            <div className="row">
            <div className="col-6">
            <TextField 
                margin="dense"
                id="cpuCoverage"
                label="CPU"
                name="cpuCoverage"
                value={cpuCoverage}
                onChange={e => setCpuCoverage(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
            <TextField 
                margin="dense"
                id="hardDriveCoverage"
                label="Hard Drive"
                name="hardDriveCoverage"
                value={hardDriveCoverage}
                onChange={e => setHardDriveCoverage(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
            <TextField
                margin="dense"
                name="softwareCoverage"
                label="Software"
                type="softwareCoverage"
                id="softwareCoverage"
                value={softwareCoverage}
                onChange={e => setSoftwareCoverage(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
            <TextField
                margin="dense"
                name="sensorsCoverage"
                label="Sensors"
                type="sensorsCoverage"
                id="sensorsCoverage"
                value={sensorsCoverage}
                onChange={e => setSensorsCoverage(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
            </div>
            <div className="col-6">
            <TextField 
                margin="dense"
                id="cosmeticsCoverage"
                label="Cosmetics"
                name="cosmeticsCoverage"
                value={cosmeticsCoverage}
                onChange={e => setCosmeticsCoverage(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
            <TextField 
                margin="dense"
                id="motorsCoverage"
                label="Motors"
                name="motorsCoverage"
                value={motorsCoverage}
                onChange={e => setMotorsCoverage(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
            <TextField 
                margin="dense"
                id="deductibleClaim"
                label="Deductible Claim"
                name="deductibleClaim"
                value={deductibleClaim}
                onChange={e => setDeductibleClaim(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
            </div>   
        </div>    
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }