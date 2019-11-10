import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppBar } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import RadioButtons from './RadioButtons'
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import theme from '../theme';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
var dotenv = require('dotenv');
dotenv.config();

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        first: '',
        last: ''
      },
      email: '',
      password: '',
      address: {
        "streetAddress": '',
        "city": '',
        "state": '',
        "zipCode": 0
      },
      DOB: '',
      accountType: null,
    }
  }

  handleStreetAddressChange = (event) => {
    const inputStreetAddress = event.target.value;
    this.setState(prev => ({address: {...prev.address, streetAddress: inputStreetAddress } }));
  }

  handleCityChange = (event) => {
    const inputCity = event.target.value;
    this.setState(prev => ({address: {...prev.address, city: inputCity} }));
  }

  handleStateChange = (event) => {
    const inputState = event.target.value;
    this.setState(prev => ({address: {...prev.address, state: inputState} }))
  }

  handleZipChange = (event) => {
    const inputZip = event.target.value;
    this.setState(prev => ({address: {...prev.address, zipCode: inputZip} }))
  }

  handleFirstNameChange = (event) => {
    const inputFirstName = event.target.value;
    this.setState(prev => ({name: {...prev.name, first: inputFirstName} }))
  }

  handleLastNameChange = (event) => {
    const inputLastName = event.target.value;
    this.setState(prev => ({name: {...prev.name, last: inputLastName} }))
  }

  // regexTestPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  registerButton(event) {
    var apiBasedUrl = "https://" + encodeURIComponent(process.env.DEV) + "hpcompost.com/api/users";
    var self = this;

    console.log("values", this.state.name.first, 
                          this.state.name.last, 
                          this.state.email, 
                          this.state.password, 
                          this.state.address, 
                          this.state.DOB,
                          this.state.accountType);
    
    if (this.state.name.first === "" || 
        this.state.name.last === "" || 
        this.state.email === "" || 
        this.state.password === "" || 
        this.state.DOB === "" || 
        this.state.address.streetAddress === "" || 
        this.state.address.city === "" || 
        this.state.address.state === "" ||
        this.state.accountType === null) {
      alert("Fill in all fields!")
      console.log("Missing fields")
    }

    // trim fields whitespace
    let firstNameTrimmed = this.state.name.first.trim()
    let lastNameTrimmed = this.state.name.last.trim()
    let emailTrimmed = this.state.email.trim()
    let passwordTrimmed = this.state.password.trim()
    let dobTrimmed = this.state.DOB.trim()
    let streetAddressTrimmed = this.state.address.streetAddress.trim()
    let cityTrimmed = this.state.address.city.trim()
    let stateTrimmed = this.state.address.state.trim()

    // // test pw and zip code
    // if (!this.regexTestPassword.test(this.passwordTrimmed)) {
    //   alert("weak pw")
    // }

    var payload = {
      "name": {
        "first": firstNameTrimmed,
        "last": lastNameTrimmed
      },
      "email": emailTrimmed,
      "password": passwordTrimmed,
      "DOB": dobTrimmed,
      "address": {
        "streetAddress": streetAddressTrimmed,
        "city": cityTrimmed,
        "state": stateTrimmed,
      },
      "accountType": this.state.accountType
    }

    axios.post(apiBasedUrl + '/register', payload).then(function(response) {
      console.log(response);
       if (response.data.code == 200) {
         console.log("registration successful");
         alert("Registration successful!")
       } else if (response.data.code == 401) {
         console.log("incorrect pw");
         alert("incorrect pw");
       }
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <div>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" style={style.title}>
                  Register
                </Typography>
              </Toolbar>
            </AppBar>
            <br/>
            <br/>
            <TextField 
              label="First Name"
              onChange = {this.handleFirstNameChange}
            />
            <br />
            <br />
            <TextField 
              label="Last Name"
              onChange = {this.handleLastNameChange}
            />
            <br />
            <br />
            <TextField 
              label="Email"
              onChange = {(event, newValue) => this.setState({email: event.target.value})}
            />
            <br />
            <br />
            <TextField 
              label="Password"
              type="password"
              onChange = {(event, newValue) => this.setState({password: event.target.value})}
            />
            <br />
            <br />
            <TextField 
              label="Date of Birth"
              onChange = {(event, newValue) => this.setState({DOB: event.target.value})}
            />
            <br />
            <br />
            <TextField 
              label="Street Address"
              onChange = {this.handleStreetAddressChange}
            />
            <br />
            <TextField 
              label="City"
              onChange = {this.handleCityChange}
            />
            <br />
            <TextField 
              label="State"
              onChange = {this.handleStateChange}
            />
            <br />
            <TextField 
              label="Zip Code"
              type="number"
              onChange = {this.handleZipChange}
            />
            <br />
            <br />
            <FormControl component="fieldset">
              <FormLabel component="legend">Account Type</FormLabel>
              <RadioGroup aria-label="accountType" name="customized-radios" onChange= {(event, newValue) => this.setState({accountType: newValue})}>
                <FormControlLabel value="Contributor" control={<RadioButtons />} label="Contributor" />
                <FormControlLabel value="Homeowner" control={<RadioButtons />} label="Homeowner" />
                <FormControlLabel value="Business Owner" control={<RadioButtons />} label="Businessowner" />
              </RadioGroup>
            </FormControl>
            <br />
            <br />
            <Button 
              variant="contained"
              color="primary"
              style={style}
              onClick={(event) => this.registerButton(event)}
            >Submit</Button>
          </div>
        </ThemeProvider>
      </div>
    );
  }
}

const style = {
  margin: 15,
  title: {
    flexGrow: 1
  }
};

export default Register;
