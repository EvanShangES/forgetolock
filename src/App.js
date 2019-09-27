import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'

import Home from './components/general/Home';
import Register from './components/general/Register';
import Login from './components/general/Login';
import Dashboard from './components/general/Dashboard';
import ServiceAreas from "./components/general/ServiceAreas";
import NavMenu from "./components/layout/NavMenu";

import { Provider } from "react-redux";
import store from "./redux/store";

import {setCurrentUser, loggedIn, logout} from "./actions/authActions";


//check if user is logged in.
loggedIn(function(response){
    if(response.status === 200){
        store.dispatch(setCurrentUser(response));
    }else{
        logout();
    }
});


class App extends Component {
    render(){
        return (
            <Provider store={store}>
                <Router>
                    <NavMenu/>
                    <Route exact path="/" render={() => <Home/>}/>
                    <Route exact path="/home" render={() => <Home/>}/>
                    <Route exact path="/register" render={() => <Register/>}/>
                    <Route exact path="/login" render={() => <Login/>}/>
                    <Route exact path="/dashboard" render={() => <Dashboard/>}/>
                    <Route exact path="/serviceAreas" render={() => <ServiceAreas/>}/>
                </Router>
            </Provider>
        )
    }
}

export default App;