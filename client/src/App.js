import React, { Component } from 'react';
import './App.css';
import LoginScreen from './components/LoginSceen/LoginScreen';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Map from './components/Map/Map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route>
              <h1>Host, Post, and Compost</h1>
              <p>Welcome to HPC</p>
            </Route>
            <Route path="/users/login">
              <Login />
              <ButtonSpaceForLogin />
            </Route>
            <Route path="/users/register">
              <Register />
              <ButtonSpaceForRegister />
            </Route>
            <Route path="/map" component={ Map } />
          </Switch>
        </Router>
      </div>
    )
  }
}

function ButtonSpaceForLogin() {
  return(
    <div>
      <Link to="/users/register">
        <button label="Register"></button>
      </Link>
    </div>
  );
}

function ButtonSpaceForRegister() {
  return(
    <div>
      <Link to="/users/login">
        <button label="Login"></button>
      </Link>
    </div>
  );
}

export default App;
