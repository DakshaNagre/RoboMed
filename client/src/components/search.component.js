// import 'isomorphic-fetch';
import axios from 'axios';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fade,makeStyles } from '@material-ui/core/styles';
import { withRouter,Link as A } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  text:{
    color:"white"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
}));

function Search(props) {
  
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [selected,setSelected]=React.useState("");
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    // if (selected === '') {
    //   setOptions([]);
    //   return undefined;
    // }

    (async () => {
      let response = await axios.post('/getUsersByRole', {"role":"doctor"})
      await sleep(1e3); 
      let countries = response.data;
      response = await axios.post('/getUsersByRole', {"role":"insuranceAgent"})
      countries=countries.concat(response.data);
      if (active) {
        setOptions(countries.map((data)=>data) || []);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = event => {
    // event.preventDefault()
    // setOptions(oldValues => ({
    //   ...oldValues,
    //   [event.target.name]: event.target.value,
    // }))
    // if (event.key === 'Enter')
    // {
    console.log(event.target.value)
    setSelected(event.target.value)
    setOpen(false);
    props.history.push('/dashboard/search/'+event.target.value)
    // }
    // console.log(event.currentTarget.innerText)
    // let name=event.currentTarget.innerText
    // setOpen(false);
    // props.history.push('/dashboard/search:'+name)
  }
// const onKeyPress=(e)=>{
//   if (e.key === 'Enter') {
//       console.log(e)
//   }
// }
  return (
    <Autocomplete
    disableOpenOnFocus
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={option => option ? option["firstName"]+" "+option["lastName"]+" "
      +option["id"]+" "+option["_id"] : "" }
      //   ( 
      //  <div> <Typography>
      //   {option["firstName"]+" "+option["lastName"]}
      //   </Typography>
      //   <Typography color="textSecondary" variant="subtitle1">{option["id"]}</Typography>
      //   </div>
      // )
    // }
      autoComplete
      includeInputInList
      freeSolo
      options={options}
      loading={loading}
      // value={options}
      onChange={handleChange}
      // onKeyPress={onKeyPress}
      renderInput={(params,i) => (
                  <TextField
                  {...params}
                  placeholder="Search..."
                  fullWidth
                  // onKeyPress={handleChange}
                  InputProps={{
                    ...params.InputProps,
                    className:classes.text,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                  />
                )}

        renderOption={option => {
            return(
              <div> <Typography>
              {option["firstName"]+" "+option["lastName"]}
              </Typography>
              <Typography color="textSecondary" variant="subtitle1">{option["_id"]}</Typography>
              <Typography color="textSecondary" variant="subtitle2">{option["id"]}</Typography>
              </div>
              )
        }}
    />
  );
}
export default withRouter(Search)
//Junk code
{/* <div className={classes.search}>
<div className={classes.searchIcon}>
  <SearchIcon />
</div>
<InputBase
  placeholder="Search…"
  {...params}
  classes={{
    root: classes.inputRoot,
    input: classes.inputInput,
  }}
  onKeyPress={event => {
    if (event.key === 'Enter') {
      console.log(options)
    }}}
  inputProps={{ ...params.InputProps,
    endAdornment: (
      <React.Fragment>
        {loading ? <CircularProgress color="inherit" size={20} /> : null}
        {params.InputProps.endAdornment}
      </React.Fragment>
    ),}}
/>
</div> */}
