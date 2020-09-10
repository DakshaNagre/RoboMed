import React,{useState,useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import Upload from './upload.component';
import { useCookies } from 'react-cookie';
import axios from 'axios';

export default function EditProfileModal(props) {
  
  const [cookies, setCookie] = useCookies(['userProfile']);
  const [open, setOpen] = React.useState(false);
  const [insuranceid,setInsuranceid]=useState("");

  const [ram,setRam]=useState(cookies['userProfile']['ram']);
  const [harddisk,setHarddisk]=useState(cookies['userProfile']['hardDisk']);
  const [cores,setCores]=useState(cookies['userProfile']['cores']);
  const [manufacturer,setManufacturer]=useState(cookies['userProfile']['manufacturer']);
  const [material,setMaterial]=useState(cookies['userProfile']['material']);
  const [power,setPower]=useState(cookies['userProfile']['power']);
  const [motorType,setMotorType]=useState(cookies['userProfile']['motorType']);
  const [softwareVersion,setSoftwareVersion]=useState(cookies['userProfile']['softwareVersion']);
  const [processor,setProcessor]=useState(cookies['userProfile']['processor'])
  const [picture,setPicture]=useState(cookies['userProfile']['picture'])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    let data=cookies['userProfile']
    data['ram']=ram
    data['picture']=picture
    data['hardDisk']=harddisk
    data['cores']=cores
    data['manufacturer']=manufacturer
    data['material']=material
    data['power']=power
    data['motorType']=motorType
    data['softwareVersion']=softwareVersion
    data['processor']=processor
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
                id="cores"
                label="Cores"
                name="cores"
                value={cores}
                onChange={e => setCores(e.target.value)}
                />
            <TextField 
                margin="dense"
                id="manufacturer"
                label="Manufacturer"
                name="manufacturer"
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
                />
            <TextField
                margin="dense"
                name="ram"
                label="Ram"
                type="ram"
                id="ram"
                value={ram}
                onChange={e => setRam(e.target.value)}
                />
            <TextField
                margin="dense"
                name="harddisk"
                label="Hard Disk"
                type="harddisk"
                id="harddisk"
                value={harddisk}
                onChange={e => setHarddisk(e.target.value)}
                />
            <TextField
                margin="dense"
                name="processor"
                label="Processor"
                type="processor"
                id="processor"
                value={processor}
                onChange={e => setProcessor(e.target.value)}
                />
            </div>
            <div className="col-6">
            <TextField 
                margin="dense"
                
                id="material"
                label="Material"
                name="material"
                value={material}
                onChange={e => setMaterial(e.target.value)}
                />
            <TextField 
                margin="dense"
                
                id="power"
                label="Power"
                name="power"
                value={power}
                onChange={e => setPower(e.target.value)}
                />
            <TextField
                    margin="dense"
                
                name="motorType"
                label="Motor Type"
                type="motorType"
                id="motorType"
                value={motorType}
                onChange={e => setMotorType(e.target.value)}
                />
            <TextField
                margin="dense"
                
                name="softwareVersion"
                label="Software Version"
                type="softwareVersion"
                id="softwareVersion"
                value={softwareVersion}
                onChange={e => setSoftwareVersion(e.target.value)}
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