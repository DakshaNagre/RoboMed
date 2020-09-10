import React from "react";
import Dashboard from "./components/dashboard.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Tfa from "./components/tfa.component";
import ForgetPassword from "./components/forgetpassword.component"
import {  BrowserRouter as Router, Route, Link ,Switch} from 'react-router-dom';

const routes={
    '/':()=><Home/>,
    '/dashboard':()=><Dashboard/>,
    '/register':()=><Register/>
}

function Routes(){
return(
    <Router>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/tfa" component={Tfa} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/register" component={Register} />
        <Route path="/forgotPassword" component={ForgetPassword} />
    </Switch>
    </Router>
)
}
export default Routes