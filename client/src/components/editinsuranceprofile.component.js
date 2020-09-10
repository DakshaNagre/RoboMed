import React,{useState,useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import { useCookies } from 'react-cookie';
import Upload from './upload.component';
import axios from 'axios';

export default function EditInsuranceProfileModal(props) {
  
  const [cookies, setCookie] = useCookies(['userProfile']);
  const [open, setOpen] = React.useState(false);
  const [insuranceName,setInsuranceName]=useState(cookies['userProfile']['insuranceName']);
  const [description,setDescription]=useState(cookies['userProfile']['description']);
  const [picture,setPicture]=useState(cookies['userProfile']['picture'])
  const [cpuCoverage,setCpuCoverage]=useState(cookies['userProfile']['cpuCoverage']);
  const [hardDriveCoverage,setHardDriveCoverage]=useState(cookies['userProfile']['hardDriveCoverage']);
  const [softwareCoverage,setSoftwareCoverage]=useState(cookies['userProfile']['softwareCoverage']);
  const [cosmeticsCoverage,setCosmeticsCoverage]=useState(cookies['userProfile']['cosmeticsCoverage']);
  const [sensorsCoverage,setSensorsCoverage]=useState(cookies['userProfile']['sensorsCoverage']);
  const [motorsCoverage,setMotorsCoverage]=useState(cookies['userProfile']['motorsCoverage']);
  const [deductibleClaim,setDeductibleClaim]=useState(cookies['userProfile']['deductibleClaim']);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    let data=cookies['userProfile']
    data['cpuCoverage']=cpuCoverage
    data['hardDriveCoverage']=hardDriveCoverage
    data['softwareCoverage']=softwareCoverage
    data['description']=description
    data['cosmeticsCoverage']=cosmeticsCoverage
    data['picture']=picture
    data['insuranceName']=insuranceName
    data['sensorsCoverage']=sensorsCoverage
    data['motorsCoverage']=motorsCoverage
    data['deductibleClaim']=deductibleClaim

    console.log(data)
    axios.post('/updateProfileById', data)
        .then(res => 
            {
                console.log(res)
                props.getProfileById()
            })
        .catch((error)=>{
            console.log(error)
            })
    setOpen(false);
  }

  useEffect(()=>{
  },[])
  return (
    <div>
      <EditIcon onClick={handleClickOpen}/>
      {/* <Button variant="outlined" color="primary" >
        Open form dialog
      </Button> */}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the fields you wish to update.
          </DialogContentText>
          <Upload setPicture={setPicture}></Upload>
        <div className="row">
            <div className="col-6">
            <TextField 
                margin="dense"
                id="cpuCoverage"
                label="Cpu"
                name="cpuCoverage"
                value={cpuCoverage}
                onChange={e => setCpuCoverage(e.target.value)}
                />
            <TextField 
                margin="dense"
                id="hardDriveCoverage"
                label="Hard Drive"
                name="hardDriveCoverage"
                value={hardDriveCoverage}
                onChange={e => setHardDriveCoverage(e.target.value)}
                />
            <TextField
                margin="dense"
                name="softwareCoverage"
                label="Software"
                type="softwareCoverage"
                id="softwareCoverage"
                value={softwareCoverage}
                onChange={e => setSoftwareCoverage(e.target.value)}
                />
            <TextField
                margin="dense"
                name="insuranceName"
                label="Insurance Name"
                type="insuranceName"
                id="insuranceName"
                value={insuranceName}
                onChange={e => setInsuranceName(e.target.value)}
                />
            <TextField
                margin="dense"
                name="sensorsCoverage"
                label="Sensors"
                type="sensorsCoverage"
                id="sensorsCoverage"
                value={sensorsCoverage}
                onChange={e => setSensorsCoverage(e.target.value)}
                />
            </div>
            <div className="col-6">
            <TextField 
                margin="dense"
                id="description"
                label="Description"
                name="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                />
            <TextField 
                margin="dense"
                id="cosmeticsCoverage"
                label="Cosmetics"
                name="cosmeticsCoverage"
                value={cosmeticsCoverage}
                onChange={e => setCosmeticsCoverage(e.target.value)}
                />
            <TextField 
                margin="dense"
                id="motorsCoverage"
                label="Motors"
                name="motorsCoverage"
                value={motorsCoverage}
                onChange={e => setMotorsCoverage(e.target.value)}
                />
            <TextField 
                margin="dense"
                id="deductibleClaim"
                label="Deductible Claim"
                name="deductibleClaim"
                value={deductibleClaim}
                onChange={e => setDeductibleClaim(e.target.value)}
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