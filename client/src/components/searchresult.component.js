import React,{useState,useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SignIn from './signin.component'
import { withRouter } from "react-router-dom";
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
import Reviews from './reviews.component'
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import EditProfileModal from './editprofilemodal.component'
import EditDocProfileModal from './editdocprofile.component'
import {DocProfile,PatientProfile,InsuranceProfile} from './profile.component'
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

export default function SearchResult (props){

    const classes = useStyles();
    // const [cookies, setCookie] = useCookies(['userName','userData','userProfile']);
    const [userData,setUserdata]=useState({})
    const [profileData,setProfileData]=useState({})

    useEffect(() => {
        console.log(props.match.params.userId)
        // setUserdata(cookies["userData"]['data'])
        let params=props.match.params.userId.split(" ")
        getProfileById(params[2],params[3])       
       },[props])

const getProfileById=(id,userName)=>{
    axios.post('/getProfileById', {"id":id})
    .then(res => 
        {
            setProfileData(res['data'])
            // setCookie('userProfile',res['data'], { path: '/' })
            console.log(res['data'])
        }).catch((error)=>{
            console.log(error)
        })
        axios.post('/getUserInformarion', {"userName":userName})
        .then(res => 
            {
                setUserdata(res['data'])
                console.log(res['data'])
            }).catch((error)=>{
                console.log(error)
            })
    }

    return( 
        <React.Fragment>
        <CssBaseline />
        <Container component='main'>
        {userData['role']=='doctor'  && profileData?
        <DocProfile userData={userData} 
            profileData={profileData}
            mode="search"
            reviewId={userData['id']}
            getProfileById={getProfileById}
        ></DocProfile>
         :" " }
        {userData['role']=='insuranceAgent'  && profileData?  
            <InsuranceProfile 
            userData={userData} 
            profileData={profileData}
            mode="search"
            reviewId={userData['id']}
            getProfileById={getProfileById}
            ></InsuranceProfile>
         :" "}
        </Container>
        </React.Fragment>
         );
}