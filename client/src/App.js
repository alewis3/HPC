import React, { Component } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ThemeProvider } from '@material-ui/styles';
import Button from "@material-ui/core/Button";
import MapContainer from './components/MapContainer';
import theme from './theme';

class App extends Component {
  render() {
    const reload = () => window.location.reload();
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/about.html" onEnter={reload} />
            <Route path="/login">
              <Login />
              <ButtonSpaceForLogin />
            </Route>
            <Route path="/register">
              <Register />
              <ButtonSpaceForRegister />
            </Route>
            <Route path="/map" component={ MapContainer } />
            <Route path="/dashboard.html" onEnter={reload} />
            <Route path="/">
              <h1>Host, Post, and Compost</h1>
              <p>Welcome to HPC</p>
              <ButtonSpaceForLogin />
              <br />
              <ButtonSpaceForRegister />
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

function ButtonSpaceForLogin() {
  return(
    <div>
      <p>Don't have an account? Register here.</p>
      <Link to="/register">
        <ThemeProvider theme={theme}>
          <Button variant="contained" color="primary">Register</Button>
        </ThemeProvider>
      </Link>
      <br />
    </div>
  );
}

function ButtonSpaceForRegister() {
  return(
    <div>
      <p>Already have an account? Login here.</p>
      <Link to="/login">
        <ThemeProvider theme={theme}>
          <Button variant="contained" color="primary">Login</Button>
        </ThemeProvider>
      </Link>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default App;
