import React,{useState,useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SignIn from './signin.component'
import { withRouter,useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import Reviews,{CreateReview} from './reviews.component'
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import EditProfileModal from './editprofilemodal.component'
import EditDocProfileModal from './editdocprofile.component'
import EditInsuranceProfileModal from './editinsuranceprofile.component'
import GoogleMap from './map.component'

import axios from 'axios';

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
      height: 300,
    },  
    formControl: {
        margin: theme.spacing(1),
        minWidth: 50,
      },
  }));

function Profile(props){

    const classes = useStyles();
    const [cookies, setCookie] = useCookies(['userName','userData','userProfile']);
    const [userData,setUserdata]=useState({})
    const [profileData,setProfileData]=useState({})

    useEffect(() => {
        setUserdata(cookies["userData"]['data'])
        getProfileById()       
       },[])

const getProfileById=()=>{
    axios.post('/getProfileById', {"id":cookies["userData"]['data']['id']})
    .then(res => 
        {
            setProfileData(res['data'])
            setCookie('userProfile',res['data'], { path: '/' })
            console.log(res['data'])
        }).catch((error)=>{
            console.log(error)
        })
    }

    return( 
        <React.Fragment>
        <CssBaseline />
        <Container component='main'>
        {cookies["userData"]['data']['role']=='doctor'  && cookies['userProfile']?
        <DocProfile userData={userData} 
            profileData={profileData}
            mode="self"
            reviewId={cookies["userData"]['data']['id']}
            getProfileById={getProfileById}
        ></DocProfile>
         :" " }
        {cookies["userData"]['data']['role']=='patient' && cookies['userProfile']?  
            <PatientProfile 
            userData={userData} 
            profileData={profileData}
            mode="self"
            getProfileById={getProfileById}
            ></PatientProfile>
         :" "}
        {cookies["userData"]['data']['role']=='insuranceAgent' && cookies['userProfile']?  
            <InsuranceProfile 
            userData={userData} 
            profileData={profileData}
            mode="self"
            getProfileById={getProfileById}
            reviewId={cookies["userData"]['data']['id']}
            ></InsuranceProfile>
         :" "}
        </Container>
        </React.Fragment>
         );
}
export default Profile

export function DocProfile(props){
    const classes = useStyles();
    let history = useHistory();
    const gotoMessage=(e)=>{
      history.push('/dashboard/chat/'+props.userData["id"])
    }
    return(           
    <Card  style={{backgroundColor:"#fbfaff"}} className={classes.paper}>
        <CardContent>
          <div className='row'>
            <div className='col-4'>
             <CardMedia
             className={classes.media}
             image={props.profileData['picture']}
             />
            </div>
            <div className='col-4'>
             <Typography gutterBottom variant="h5" component="h2">
             {props.userData["firstName"]+" "+props.userData["lastName"]}
             {props.mode=="self"?<IconButton aria-label="settings">
                 <EditDocProfileModal getProfileById={props.getProfileById} />
             </IconButton>:""}
             </Typography>
             <Typography color="textSecondary">
             {props.profileData['qualification']}
             </Typography>
             <Typography variant="body2" component="p">
             {props.profileData['description']}
             </Typography>
             <br/>
             <div>
             <Typography color="textSecondary">
                 Rating
             </Typography>
                 <Rating name="size-large" value={props.profileData['rating']} size="large" readOnly />
             </div>
             {props.mode!="self"?
             <CardActions>
             <Button size="small" onClick={gotoMessage} color="primary">
             Message
             </Button>
             <Button size="small" color="primary">
             Book
             </Button>
              <CreateReview revieweeId={props.userData["id"]}></CreateReview>
             {/* <Button size="small" color="primary">
             Feedback
             </Button> */}
             </CardActions>:""}
            </div>
            <div className='col-4'>
            <GoogleMap address={props.profileData['address']}></GoogleMap>
            </div>
          </div>
          <br/>
          <div className="row">
          <div className='col-4'>
             <div className="row">
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Specialization
                 </Typography>    
                 <Typography>
                 {props.profileData['specialization']}
                 </Typography>
                 </div>
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Experience
                 </Typography>    
                 <Typography>
                 {props.profileData['experience']+" years"}
                 </Typography>
                 </div>
             </div>
             <br/>
          <Typography color="textSecondary">
             Address
         </Typography>    
          <Typography>
             {props.profileData['address']}
         </Typography>
         </div>               
         <div className='col-8'>
             <Reviews _id={props.reviewId}></Reviews>     
            </div>               
         {/* <div className='col-4'>      
            </div> */}
          </div>
          </CardContent>
          </Card>
          )
}

export function PatientProfile(props){
    const classes = useStyles();
    return(
        <Card  style={{backgroundColor:"#fbfaff"}} className={classes.paper}>
        <CardContent>
          <div className='row'>
            <div className='col-4'>
             <CardMedia
             className={classes.media}
             image={props.profileData['picture']}
             />
            </div>
            <div className='col-8'>
             <Typography gutterBottom variant="h5" component="h2">
             {props.userData["firstName"]+" "+props.userData["lastName"]}
             {props.mode=="self"?<IconButton aria-label="settings">
                <EditProfileModal getProfileById={props.getProfileById} />
             </IconButton>:""}
             </Typography>
             <Typography color="textSecondary">
             {props.profileData['manufacturer']}
             </Typography>
             <br/>
             <div className="row">
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 RAM
                 </Typography>    
                 <Typography>
                 {props.profileData['ram']}
                 </Typography>
                 </div>
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Hard Disk
                 </Typography>    
                 <Typography>
                 {props.profileData['hardDisk']}
                 </Typography>
                 </div>
                 </div>
                 <br/>
                 <div className="row">
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Material
                 </Typography>    
                 <Typography>
                 {props.profileData['material']}
                 </Typography>
                 </div>
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Motor Type
                 </Typography>    
                 <Typography>
                 {props.profileData['motorType']}
                 </Typography>
                 </div>
                 </div>
                 <br/>
                 <div className="row">
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Power
                 </Typography>    
                 <Typography>
                 {props.profileData['power']}
                 </Typography>
                 </div>
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Software Version
                 </Typography>    
                 <Typography>
                 {props.profileData['softwareVersion']}
                 </Typography>
                 </div>
                 </div>
                 <br/>
                 <div className="row">
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Cores
                 </Typography>    
                 <Typography>
                 {props.profileData['cores']}
                 </Typography>
                 </div>
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Processor
                 </Typography>    
                 <Typography>
                 {props.profileData['processor']}
                 </Typography>
                 </div>
                 </div>
             {/* <CardActions>
             <Button size="small" color="primary">
             Message
             </Button>
             <Button size="small" color="primary">
             Book
             </Button>
             </CardActions> */}
            </div>
          </div>
          <br/>
          {/* <div className="row">
          <div className='col-4'>
             <div className="row">
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Specialization
                 </Typography>    
                 <Typography>
                 {profileData['specialization']}
                 </Typography>
                 </div>
                 <div className='col-6'>
                 <Typography color="textSecondary">
                 Experience
                 </Typography>    
                 <Typography>
                 {profileData['experience']+" years"}
                 </Typography>
                 </div>
             </div>
             <br/>
          <Typography color="textSecondary">
             Address
         </Typography>    
          <Typography>
             {profileData['address']}
         </Typography>
         </div>               
         <div className='col-8'>
             <Reviews _id={cookies["userData"]['data']['id']}></Reviews>     
            </div>               
          </div> */}
          </CardContent>
          </Card>
    )
}

export function InsuranceProfile(props){
  const classes = useStyles();
  return(
      <Card  style={{backgroundColor:"#fbfaff"}} className={classes.paper}>
        <CardContent>
          <div className='row'>
            <div className='col-4'>
             <CardMedia
             className={classes.media}
             image={props.profileData['picture']}
             />
            </div>
            <div className='col-8'>
             <Typography gutterBottom variant="h5" component="h2">
             {props.userData["firstName"]+" "+props.userData["lastName"]}
             {props.mode=="self"?<IconButton aria-label="settings">
                 <EditInsuranceProfileModal getProfileById={props.getProfileById} />
             </IconButton>:""}
             </Typography>
             <Typography color="textSecondary">
             {props.profileData['insuranceName']}
             </Typography>
             <Typography variant="body2" component="p">
             {props.profileData['description']}
             </Typography>
             <br/>
             <div>
             <Typography color="textSecondary">
                 Rating
             </Typography>
                 <Rating name="size-large" value={props.profileData['rating']} size="large" readOnly />
             </div>
             {props.mode!="self"?
             <CardActions>
             <Button size="small" color="primary">
             Message
             </Button>
             <Button size="small" color="primary">
             Purchase
             </Button>
              <CreateReview revieweeId={props.userData["id"]}></CreateReview>
             </CardActions>:""}
            </div>
          </div>
          <br/>
          {props.mode=="self"?
          <div className="row">
          <div className='col-6'>
          <Typography variant='h6' color="textPrimary">
                    Formula Coefficients
                </Typography>
             <div className="row">
                 <div className='col-6'>
                    <Typography color="textSecondary">
                    CPU 
                    </Typography>    
                    <Typography>
                    {props.profileData['cpuCoverage']}
                    </Typography>
                    <Typography color="textSecondary">
                    Software 
                    </Typography>    
                    <Typography>
                    {props.profileData['softwareCoverage']}
                    </Typography>
                    <Typography color="textSecondary">
                    Cosmetics 
                    </Typography>    
                    <Typography>
                    {props.profileData['cosmeticsCoverage']}
                    </Typography>
                 </div>
                 <div className='col-6'>
                    <Typography color="textSecondary">
                    Hard Drive 
                    </Typography>    
                    <Typography>
                    {props.profileData['hardDriveCoverage']}
                    </Typography>
                    <Typography color="textSecondary">
                    Sensors 
                    </Typography>    
                    <Typography>
                    {props.profileData['sensorsCoverage']}
                    </Typography>
                    <Typography color="textSecondary">
                    Motors 
                    </Typography>    
                    <Typography>
                    {props.profileData['motorsCoverage']}
                    </Typography>
                    <Typography color="textSecondary">
                    Deductible Claim
                    </Typography>    
                    <Typography>
                    {props.profileData['deductibleClaim']}
                    </Typography>
                 </div>
             </div>
             <br/>
         </div>               
         <div className='col-6'>
             <Reviews _id={props.reviewId}></Reviews>     
        </div>          
        </div>:
        <div className="row">
        <div className='col-8'>
        <Reviews _id={props.reviewId}></Reviews>  
        </div>
        </div>
        }   
          </CardContent>
          </Card>
  )
}