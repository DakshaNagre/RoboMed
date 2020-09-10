import { Map, GoogleApiWrapper,Marker } from 'google-maps-react';
import React,{useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

const useStyles = makeStyles(theme => ({
    map:{
        width: '60%',
        height: '60%',
    },
}));

function GoogleMap(props){
    const classes = useStyles();
    const [loc,setLoc]=useState({lat:0,lng:0})
    useEffect(() => {
        axios.post('/getGeoLoc',{'address':props.address})
        .then((res)=>{
            setLoc(res['data'])
        }).catch((err)=>
        {
            console.error(err)
        })
    },[props.address])

    return (
        <React.Fragment>
        {/* <Typography color="textSecondary" variant='h6'>
            Location        
        </Typography> */}
         {loc.lat!=0?<Map
          google={props.google}
          zoom={8}
          className={classes.map}
          initialCenter={loc}
        >
          <Marker position={loc} />
        </Map>:''}
        </React.Fragment>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyB3Pa1d7kBXuxHV74Fy-fJlzlma_5Dzxco'
})(GoogleMap);