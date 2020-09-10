import React,{useState} from 'react'
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
const axios = require("axios");

export default function Upload(props){
    const [file,setFile]=useState(null)
    const onChange=(e)=>{
        console.log(e.target.files[0])
        setFile(e.target.files[0]);
        const formData = new FormData();
        formData.append('myImage',e.target.files[0]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/upload",formData,config)
            .then((response) => {
                props.setPicture("/static/"+response['data']['filename'])
            }).catch((error) => {
        });
    }
    return (
        // <FormControl onSubmit={onFormSubmit}>
        //     <Typography color="textSecondary">Upload Picture</Typography>
        //     <Input type="file"  name="myImage" onChange= {onChange} />
        //     <Button type="submit">Upload</Button>
        // </FormControl>
        <div>
        <Input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        name="My Image"
        onChange= {onChange}
        />
        <label htmlFor="raised-button-file">
        <Button component="span" type="submit">
        <AccountCircleIcon/> 
            Edit Picture
        </Button>
        </label>
        </div>
        )
}
