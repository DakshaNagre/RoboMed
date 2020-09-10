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

export default function EditDocProfileModal(props) {
  
  const [cookies, setCookie] = useCookies(['userProfile']);
  const [open, setOpen] = React.useState(false);
  const [qualification,setQualification]=useState(cookies['userProfile']['qualification']);
  const [specialization,setSpecialization]=useState(cookies['userProfile']['specialization']);
  const [experience,setExperience]=useState(cookies['userProfile']['experience']);
  const [description,setDescription]=useState(cookies['userProfile']['description']);
  const [address,setAddress]=useState(cookies['userProfile']['address']);
  const [picture,setPicture]=useState(cookies['userProfile']['picture'])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    let data=cookies['userProfile']
    data['qualification']=qualification
    data['specialization']=specialization
    data['experience']=experience
    data['description']=description
    data['address']=address
    data['picture']=picture

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
                id="qualification"
                label="Qualification"
                name="qualification"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                />
            <TextField 
                margin="dense"
                id="specialization"
                label="Specialization"
                name="specialization"
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                />
            <TextField
                margin="dense"
                name="experience"
                label="Experience"
                type="experience"
                id="experience"
                value={experience}
                onChange={e => setExperience(e.target.value)}
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
                id="address"
                label="Address"
                name="address"
                value={address}
                onChange={e => setAddress(e.target.value)}
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