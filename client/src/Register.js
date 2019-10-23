import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import Login from './Login';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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

  regexTestPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  registerButton(event) {
    var apiBasedUrl = "";
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
    if (!this.regexTestPassword.test(this.passwordTrimmed)) {
      alert("weak pw")
    }

    var payload = {
      "name": {
        "first": firstNameTrimmed,
        "last": lastNameTrimmed
      },
      "email:": emailTrimmed,
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
         var loginScreen = [];
         loginScreen.push(<Login parentContext={this} />);
         var loginMessage = "Not registered yet? Go to registration";
         self.props.parentContext.setState({loginScreen: loginScreen,
                                            loginMessage: loginMessage,
                                            buttonLabel: "Register",
                                            islogin: true });
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
        <MuiThemeProvider>
          <div>
            <AppBar title="Register" />
            <br/>
            <TextField 
              hintText="First name"
              onChange = {this.handleFirstNameChange}
            />
            <br />
            <br />
            <TextField 
              hintText="Last name"
              onChange = {this.handleLastNameChange}
            />
            <br />
            <br />
            <TextField 
              hintText="Email"
              onChange = {(event, newValue) => this.setState({email: newValue})}
            />
            <br />
            <br />
            <TextField 
              hintText="Password"
              type="password"
              onChange = {(event, newValue) => this.setState({password: newValue})}
            />
            <br />
            <br />
            <TextField 
              hintText="Date of Birth"
              onChange = {(event, newValue) => this.setState({DOB: newValue})}
            />
            <br />
            <br />
            <TextField 
              hintText="Street Address"
              onChange = {this.handleStreetAddressChange}
            />
            <br />
            <TextField 
              hintText="City"
              onChange = {this.handleCityChange}
            />
            <br />
            <TextField 
              hintText="State"
              onChange = {this.handleStateChange}
            />
            <br />
            <TextField 
              hintText="Zip Code"
              type="number"
              onChange = {this.handleZipChange}
            />
            <br />
            <br />
            <FormControl component="fieldset">
              <FormLabel component="legend">Account Type</FormLabel>
              <RadioGroup aria-label="accountType" name="customized-radios" onChange= {(event, newValue) => this.setState({accountType: newValue})}>
                <FormControlLabel value="contributor" control={<StyledRadio />} label="Contributor" />
                <FormControlLabel value="homeowner" control={<StyledRadio />} label="Homeowner" />
                <FormControlLabel value="businessowner" control={<StyledRadio />} label="Businessowner" />
              </RadioGroup>
            </FormControl>
            <br />
            <br />
            <RaisedButton 
              label="Submit"
              primary={true}
              style={style}
              onClick={(event) => this.registerButton(event)}
            />
            <br />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

// Inspired by blueprintjs
function StyledRadio(props) {
  const classes = radioStyles()

  return (
    <Radio 
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

const radioStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
});

const style = {
  margin: 15,
};

export default Register;