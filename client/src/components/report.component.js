import React,{useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Badge from '@material-ui/core/Badge';
import { useCookies } from 'react-cookie';


import axios from 'axios';

const useStyles = makeStyles(theme => ({
    zIndex: {
      zIndex: theme.zIndex.modal + 200,
    },
    chip: {
      margin: theme.spacing(0.5),
    },    
    card: {
      minWidth:180,
      maxWidth: 300,
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
  }));

export function Report(props){
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(['userName','userData','userProfile']);
  const [reports,setReports]=useState({})

  useEffect(() => {
      getReports()
  },[])

  const getReports=()=>{
      axios.post('/getReports',{
          'id':cookies['userData']['data']['id'],
          'role':cookies['userData']['data']['role']
          }).then((res)=>{
            let groupedReport=processReports(res['data'])
            setReports(groupedReport)
      }).catch((err)=>{
             console.error(err)
         })
  }

  const processReports=(data)=>{
      let groupedReport={}
      data.forEach((report)=>{
        let key=report['details'][0]['id']
        if(groupedReport[key]===undefined)
        {
          groupedReport[key]={
            ...report["details"],
            'reports':[]
          }
          delete report['details']
          groupedReport[key]["reports"].push(report)
        }else
        {
          delete report['details']
          groupedReport[key]["reports"].push(report)
        }
      })
      return groupedReport
  }

return( 
  <React.Fragment>
  <CssBaseline />
  <Container component='main'>
  <p></p>
  { reports.length==0? 
      <Typography color="textSecondary" variant='h5'>
            No reports currently generated!
        </Typography>
    : 
      <div>
      <Typography color="textSecondary" variant='h6'>
          Reports
      </Typography>
      <br/>
      
      {Object.keys(reports).map((key, i) =>
        <div>
        <Typography color="textSecondary" variant='h6'>
        {reports[key][0]["firstName"]+" "+reports[key][0]["lastName"]}
        </Typography>
        <div key={key} className='row'>
            {reports[key]["reports"].map((report,i)=>
            <div key={report['_id']} className='col-3'>
                
            <ReportTile role={cookies['userData']['data']['role']}  
            data={report} getReports={getReports} />
            <br/>
            </div>
            )}
        </div>
        <Divider />
        </div>
        )}
      </div>
  }
  </Container>
  </React.Fragment>
 )
}

export function CreateReport(props){
    const [open, setOpen] = React.useState(false);
    const [diagnosis,setDiagnosis]=React.useState("")
    const [prescription,setPrescription]=React.useState(medicines)
    const [price,setPrice]=React.useState()
    const classes=useStyles()

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  const handleSubmit=()=>{
    let appID=props.id
    let data={
        "appointmentId":appID,
        "patient":props.patient,
        "doctor":props.doctor,
        "diagnosis":diagnosis,
        "prescription":prescription,
        "price":price
    }
    axios.post('/createReportBill', data)
    .then(res => 
        {
            console.log(res['data'])
            setOpen(false);
            // setReviews(res['data'])
        }).catch((error)=>{
            console.log(error)
        })
  }
  const handleChange = event => {
    console.log(event.target.value)
    }
    const handleDelete = chipToDelete => () => {
        setPrescription(chips => chips.filter(chip => chip !== chipToDelete));
      };
    return (
      <div>
        <Button size="small" color="primary" color="primary" onClick={handleClickOpen}>
        Report
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Medical Report</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Provide diagnosis for your patient.
            </DialogContentText>
            {/* <Typography component="legend" color="textPrimary">Rating</Typography>
            <Rating
              name="controlled"
              value={rate}
              onChange={(e, newValue) => {
                setRate(newValue)
              }}
            /> */}

            <TextField
              autoFocus
              margin="dense"
              id="diagnosis"
              label="Diagnosis"
              type="text"
              fullWidth
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
            />
            {/* <TextField
              margin="dense"
              id="prescription"
              label="Prescription"
              type="text"
              fullWidth
              value={prescription}
              onChange={e => setPrescription(e.target.value)}
            /> */}
    <Typography variant="body2" color="textSecondary" component="p">
        Prescription
    </Typography>  
    <br/>      
    {prescription.map(data => {
        return (
          <Chip
            key={data}
            label={data}
            onDelete={handleDelete(data)}
            className={classes.chip}
          />
        );
      })}
            {/* <Autocomplete
                multiple
                id="tags-standard"
                options={medicines}
                getOptionLabel={option => option}
                disableOpenOnFocus
                renderInput={params => (
                <TextField
                    {...params}
                    // variant="standard"
                    // label="Multiple values"
                    placeholder="Prescription"
                    margin="normal"
                    fullWidth
                />
                )}
            /> */}
            <TextField
              margin="dense"
              id="price"
              label="Bill"
              type="text"
              fullWidth
              value={price}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              onChange={e => setPrice(e.target.value)}
            />
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

export function ReportTile(props){
    const classes = useStyles();
    const [reportData,setReportData]=useState(props.data)
    // const handlePay=()=>{
    //     axios.post('/payBill',{"id":billData._id})
    //     .then(res => {
    //         console.log(res['data'])
    //         props.getBills()
    //     }).catch((error)=>{
    //     console.log(error)
    //     })
    // }
    return (
        // <Badge color="secondary" invisible={reportData.status!="due"} 
        // badgeContent={'P'} className={classes.margin}>
        <Card style={{backgroundColor:"#fbfaff"}} className={classes.card}>
          <CardActionArea onClick={()=>{console.log("Hi")}}>
            {/* <CardMedia
              className={classes.media}
              image="/static/images/cards/contemplative-reptile.jpg"
              title="Contemplative Reptile"
            /> */}
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {reportData._id}
              </Typography>
            {/* <div className="row">
              <div className="col-6"> */}
                <Typography  className={classes.pos} color="primary" >
                 Appointment - {reportData.appointmentId}
                </Typography>
              {/* </div>
              <div className="col-6"> */}
                {/* <Typography className={classes.pos}>
                  
                </Typography> */}
              {/* </div>
              </div> */}
            <Typography  className={classes.pos} color="">
                Diagnosis
             </Typography>
              <Typography color='primary'>
              {reportData.diagnosis}
              </Typography>
              <Typography className={classes.pos} color="">
                Prescription
             </Typography>
             {reportData.prescription.map(data => {
                return (
                  <Chip
                    key={data}
                    label={data}
                    color="secondary"
                    variant="outlined"
                    // onDelete={handleDelete(data)}
                    className={classes.chip}
                  />
                );
              })}
            </CardContent>
          </CardActionArea>
          {/* {billData['status']=='due' && props.role=="insuranceAgent"? 
          <CardActions>
            <Button size="small" onClick={handlePay} color="primary">
              Pay
            </Button>
          </CardActions>
          : ""} */}
        </Card>
      );
}

const medicines=["adjustable wrench",
"wrench", "screwdriver bits", "tape measure","hammer",
"knife", "socket", 
 "glue gun","steel wool", "miter block", "sandpaper", "chisel"]