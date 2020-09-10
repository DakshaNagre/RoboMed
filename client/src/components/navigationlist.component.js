import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { withRouter } from "react-router-dom";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Schedule from '@material-ui/icons/Schedule'
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import {Link} from 'react-router-dom'
import { useCookies } from 'react-cookie';

export const LogOut=(props)=>{
  const [cookies, , removeCookie] = useCookies(['userName','userData'])
  return(
    <ListItem 
    onClick={()=>{
      removeCookie("userName")
      removeCookie("userData")
      removeCookie("userProfile")
    }} 
    component={Link} to="/"
     button>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>
  )
}

export const patientOptions = (
  <div>
    <ListItem component={Link} to="/dashboard" button>
      <ListItemIcon>
      <Schedule style={{color:'#BCBABE'}} />
        {/* <DashboardIcon /> */}
      </ListItemIcon>
      <ListItemText primary="Appointments" />
    </ListItem>
    <ListItem component={Link} to="/dashboard/billing" button>
      <ListItemIcon>
        <ReceiptIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Billing" />
    </ListItem>
    <ListItem component={Link} to="/dashboard/report" button>
      <ListItemIcon>
        <AssignmentIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem component={Link} to="/dashboard/insurance" button>
      <ListItemIcon>
        <LoyaltyIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Insurance" />
    </ListItem>
    {/* <ListItem component={Link} to="/dashboard/stats" button>
      <ListItemIcon>
      <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Statistics" />
    </ListItem> */}
  </div>
)

export const doctorOptions = (
  <div>
    <ListItem component={Link} to="/dashboard" button>
      <ListItemIcon>
      <Schedule style={{color:'#BCBABE'}}/>
        {/* <DashboardIcon /> */}
      </ListItemIcon>
      <ListItemText primary="Appointments" />
    </ListItem>
    <ListItem component={Link} to="/dashboard/billing" button>
      <ListItemIcon>
        <ReceiptIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Billing" />
    </ListItem>
    <ListItem component={Link} to="/dashboard/report" button>
      <ListItemIcon>
        <AssignmentIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem component={Link} to="/dashboard/chat/doctor" button>
      <ListItemIcon>
      <ChatIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Discussions" />
    </ListItem>
  </div>
)

export const insuranceOptions = (
  <div>
    <ListItem component={Link} to="/dashboard" button>
      <ListItemIcon>
      <BarChartIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Metrics" />
    </ListItem>
    <ListItem component={Link} to="/dashboard/billing" button>
      <ListItemIcon>
        <ReceiptIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Billing" />
    </ListItem>
  </div>
)


export const secondaryListItems = (
    <div>
    <ListSubheader style={{color:'#BCBABE'}} inset>Report History</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon style={{color:'#BCBABE'}}/>
      </ListItemIcon>
      <ListItemText primary="Last Year" />
    </ListItem>
  </div>
);

export const popoverMenu = (
    <div>
    <ListItem component={Link} to="/dashboard/profile" button>
      <ListItemIcon>
        <PermIdentityIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItem>
    <LogOut></LogOut>
    </div>
)
