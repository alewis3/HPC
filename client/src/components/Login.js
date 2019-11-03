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
    var apiBaseUrl = "https://hpcompost.com/api/users";

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
      if (response.status == 200 && response.data.accountType == "Contributor") {
        window.location.href = "https://hpcompost.com/map";
      } else if (response.status == 200 && response.data.accountType == "Homeowner" || response.data.accountType == "Business Owner") {
        window.location.href = "https://hpcompost.com/dashboard.html";
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
