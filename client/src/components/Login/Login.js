import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  // loginButton will call api with users email and pw
  // will recieve code and log appropriate response
  loginButton(event) {
    var self = this;
    var apiBaseUrl = "https://hpcompost.com/login";

    // test for empty fields
    if (this.state.email === "" || this.state.password === "") {
      alert("Fill in all fields!")
    }

    // trim white space from fields
    let emailTrimmed = this.state.email.trim()
    let passwordTrimmed = this.state.password.trim()

    var payload = {
      "email": emailTrimmed,
      "password": passwordTrimmed
    }

    axios.post(apiBaseUrl + '/login', payload).then(function(response) {
      console.log(response);

      if (response.data.code == 200) {
        console.log("Login successful.");
      } else if (response.data.code == 204) {
        console.log("Email password do not match");
        alert("Email password do not match")
      } else if (response.data.code == 401) {
        console.log("incorrect pw");
        alert("incorrect pw");
      } else {
        console.log("Email does not exist");
        alert("Email does not exist")
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="User Login"
            />
            <TextField
              hintText="Email"
              onChange = {(event, newValue) => this.setState({email: newValue})}
            />
            <br/>
            <br/>
            <TextField
              type="password"
              hintText="Password"
              onChange = {(event, newValue) => this.setState({password: newValue})}
            />
            <br/>
            <RaisedButton
              label="Submit" 
              primary={true} 
              style={style}
              onClick={(event) => this.loginButton(event)}
            />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

const style = {
  margin: 15,
};

export default Login;
