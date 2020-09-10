import React,{useEffect,useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    card: {
      minWidth:150,
      maxWidth: 200,
    },
    media: {
      height: 50,
    },
    pos: {
      marginBottom: 12,
    },
    margin: {
      margin: theme.spacing(2),
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
  }));

export default function Stats(props){
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [cookies, setCookie] = useCookies(['userName','userData','userProfile'])
    //const [insuranceId, setInsuranceId] = useState(cookies['userProfile']['insuranceId'])
    const [patients,setPatients]=useState([])
    const [bills,setBills]=useState([])
    const [payable,setPayable]=useState([])
    const [dues,setDues]=useState([])
    // const [cpuWeight,setCpuWeight]=useState(cookies['userProfile']['cpuCoverage']);
    // const [hardDriveWeight,setHardDriveWeight]=useState(cookies['userProfile']['hardDriveCoverage']);
    // const [softwareWeight,setSoftwareWeight]=useState(cookies['userProfile']['softwareCoverage']);
    // const [cosmeticsWeight,setCosmeticsWeight]=useState(cookies['userProfile']['cosmeticsCoverage']);
    // const [sensorsWeight,setSensorsWeight]=useState(cookies['userProfile']['sensorsCoverage']);
    // const [motorsWeight,setMotorsWeight]=useState(cookies['userProfile']['motorsCoverage']);
    // const [deductibleClaimWeight,setDeductibleClaimWeight]=useState(cookies['userProfile']['deductibleClaim']);

useEffect(() => {
if(cookies['userProfile']!=undefined){  
    axios.post('/getBills',{
        'id':cookies['userData']['data']['id'],
        'role':cookies['userData']['data']['role']
        }).then((res)=>{

            setBills(res['data'])
            // console.log(bills)
            let payableArr=[]
            let duesArr=[]

            res['data'].forEach((bill)=>{
                if(bill["doctor"]==undefined){
                    duesArr.push(parseInt(bill['price']))
                }
                else{
                    payableArr.push(parseInt(bill['price']))
                }
            })
            // console.log(payableArr +"  "+duesArr)
            setPayable(payableArr)
            setDues(duesArr)
            // console.log(dues)
            // processBill(res['data'])
    }).catch((err)=>{
           console.error(err)
       })
  axios.post('/getUsersByInsurId', {"insuranceId":cookies['userProfile']['_id']})
  .then(res =>
      {
        setPatients(res['data'])
      }).catch((error)=>{
          console.log(error)
    })
}
},[cookies['userProfile']])

return (
    <React.Fragment>
    <CssBaseline />
    <Container component='main'>
    <p></p>
    { patients.length==0? 
        <Typography color="textSecondary" variant='h5'>
              No one is signed up!
          </Typography>
      : 
        <div>
            <Typography color="textSecondary" variant='h6'>
                Metrics
            </Typography>
            <br/>
            <div className='row'>
                <div className='col-4'>
                    <MetricTile title="Patient Count" value={patients.length}/>
                </div>      
                <div className='col-4'>
                    <MetricTile title="Total Revenue" value={"$ "+dues.reduce((a, b) => a + b, 0)}/>
                </div> 
                <div className='col-4'>
                    <MetricTile title="Total Payable" value={"$ "+payable.reduce((a, b) => a + b, 0)}/>
                </div>                
                {/* <div className='col-3'>
                    <MetricTile title="" value={patients.length}/>
                </div> */}
            </div>
            <br/>
            <br/>
            <div className='row'>
                <div className='col-12'>
                <Paper style={{backgroundColor:"#fbfaff"}} className={fixedHeightPaper}>
                    <Chart bills={bills} />
                </Paper>   
                </div>         
            </div>
        </div>
    }
    </Container>
    </React.Fragment>
    )
}

export function MetricTile(props){
    const classes = useStyles();
    const [metricData,setMetricData]=useState(props)
    return (
        <Card style={{backgroundColor:"#fbfaff"}} className={classes.card}>
          <CardActionArea onClick={()=>{console.log("Hi")}}>
            {/* <CardMedia
              className={classes.media}
              image="/static/images/cards/contemplative-reptile.jpg"
              title="Contemplative Reptile"
            /> */}
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {metricData.title}
              </Typography>
            {/* <Typography className={classes.pos} color="textSecondary">
              Appointment No.
            </Typography>
              <Typography className={classes.pos} color="textPrimary">
              {billData.appointmentId}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
                Total
             </Typography> */}
              <Typography variant="h6" color="textSecondary">
              {metricData.value}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      );
}

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('00:00', 100),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

export function Chart(props) {
  const theme = useTheme();

  return (
    <React.Fragment>
      {/* <Title>Today</Title> */}
      <ResponsiveContainer>
        <LineChart 
          data={props.bills}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Bill($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="price" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}