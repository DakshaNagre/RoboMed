import React,{useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Rating from '@material-ui/lab/Rating';
import RateReviewIcon from '@material-ui/icons/RateReview';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function Reviews(props) {
  const classes = useStyles();
  const [reviews,setReviews]=useState([])
  useEffect(() => {
    axios.post('/fetchReview', {"id":props._id})
    .then(res => 
        {
            console.log(res['data'])
            setReviews(res['data'])

        }).catch((error)=>{
            console.log(error)
        })
  },[])

  return (
    <div className={classes.root}>
        {reviews.map((review,i)=>
            <ExpansionPanel key={i}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <Typography className={classes.heading}>
                 <PersonIcon style={{color: '#3f51b5'}}/>
                 &nbsp;&nbsp;&nbsp;{review['title']}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <Typography color="textSecondary">
            <Rating name="size-small" value={review['rating']} size="small" readOnly />
            <br/>
            {review['review']}
            </Typography>
            &nbsp;
            <Typography color="textSecondary">
                {new Date(review['dateTime']).toLocaleDateString()}
            </Typography>
            </ExpansionPanelDetails>
            </ExpansionPanel>
        )}
      {/* <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Expansion Panel 1</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Expansion Panel 2</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography className={classes.heading}>Disabled Expansion Panel</Typography>
        </ExpansionPanelSummary>
      </ExpansionPanel> */}
    </div>
  );
}

export function CreateReview(props){
  const [open, setOpen] = React.useState(false);
  const [title,setTitle]=React.useState("")
  const [review,setReview]=React.useState("")
  const [rate,setRate]=React.useState(0)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
const handleSubmit=()=>{
  let revieweeId=props.revieweeId
  let data={
      "reviewerId":"",
      "revieweeId":revieweeId,
      "title":title,
      "review":review,
      "rating":rate
  }
  axios.post('/createReview', data)
  .then(res => 
      {
          console.log(res['data'])
          setOpen(false);
          // setReviews(res['data'])
      }).catch((error)=>{
          console.log(error)
      })
}

  return (
    <div>
      <Button size="small" color="primary" color="primary" onClick={handleClickOpen}>
      Feedback
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Write Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Provide feedback from your previous encounter.
          </DialogContentText>
          <Typography component="legend" color="textPrimary">Rating</Typography>
          <Rating
            name="controlled"
            value={rate}
            onChange={(e, newValue) => {
              setRate(newValue)
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="review"
            label="Review"
            type="text"
            fullWidth
            value={review}
            onChange={e => setReview(e.target.value)}
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