var express = require('express');
var router = express.Router();
var is = require('is_js');
var uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2; 
let mongoose = require('mongoose');
let User = require('../models/User');
let nodemailer = require('nodemailer');

var dotenv = require('dotenv');
dotenv.config();

const salt = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.options('/register', function (req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "accept, content-type");
  res.setHeader("Access-Control-Max-Age", "1728000");
  res.status(200).send();
});

/*
 * This route handles registering a user. The request will include an email,
 * password, first and last name, account type, and a birthday in string format.
 * It handles sending an email to the specified email.
 */
router.post("/register", async (req, res) => {

  var token = uuid();

  const json = req.body;
  const email = json.email;
  const firstName = json.name.first;
  const lastName = json.name.last;

  var newUser = new User({
    email: json.email,
    password: json.password,
    name: {
      first: json.name.first,
      last: json.name.last
    },
    accountType: json.accountType,
    birthday: json.DOB, 
    address: {
      streetAddress: json.address.streetAddress,
      city: json.address.city,
      state: json.address.state,
      zip: json.address.zip
    },
    validated: false,
    validationToken: token
  });

  newUser.save(function(err, data) {
    if (err) {
      console.log(err);
      res.status(401).send({"registrationStatus": "false", "error": err});
    }
    else {
      console.log(data);
      var url = "https://hpcompost.com/api/users/validate?userId=" + data._id + "&token=" + token;
      sendmail(email, firstName, lastName, "Confirm your HPC Account", firstName + ", please confirm your account! Click this link: " + url, firstName + ", please confirm your account by clicking <a href=" + url + ">this link</a>!");
      res.status(201).send({"registrationStatus": "true"});
    }
  });

});

/*
 * This route handles logging in a user. This is after the user has been authenticated. 
 * The validated field must be true for this user. 
 */
router.post('/login', async (req, res) => {
  const json = req.body;
  const email = json.email;
  const password = json.password;

  var user = await User.findOne({ email: email }).exec();
  if(!user) {
    return res.status(401).send({ loginStatus: "false", message: "The username does not exist" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if(!passwordMatch) {
    return res.status(401).send({ loginStatus: "false", message: "The password is invalid" });
  }
  const validated = user.validated;
  if(!validated) {
    return res.status(401).send({ loginStatus: "false", message: "The user is not validated" });

  }
  return res.status(200).send({loginStatus: "true", "accountType": user.accountType});
});


/*
 * This path handles validating a user after they register. in the get request query
 * there are two variables, the userId, and the token to match to. It calls the static 
 * method validateUser and sends in those two tokens. Validate user will update the validated
 * attribute of this user to true if the tokens match and if not, it will not do anything and 
 * throw an error. 
 */
router.get('/validate', async (req, res) => {
  const userId = req.query.userId;
  const token = req.query.token;

  var user = await User.validateUser(userId, token, function(err, data) {
    if (err) {
      console.log("The user could not be validated.");
      res.status(403).render('failure', {title: "Your account was not confirmed!"});
      throw err;
    }
    else {
      if (data != null) {
        console.log(data);
        res.status(200).render('success', {title: "Thank you for confirming your account!", name: data.name.first});
      }
      else {
        res.status(403).render('failure', {title: "Your account was not confirmed!"});
      }
      return data;
    }
  });

});
function sendmail(email, firstName, lastName, subject, body, htmlBody) {

  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID, // ClientID
    process.env.CLIENT_SECRET, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });
  const accessToken = oauth2Client.getAccessToken()

  var auth = {
    type: 'oauth2',
    user: 'alewis3@stedwards.edu',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: accessToken
  };

  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: auth
  });

  // Message object
  let message = {
      from: 'NO_REPLY <no-reply@hpcompost.com>',
      to: email,
      subject: String(subject),
      text: String(body),
      html: String(htmlBody)
  };

  transporter.sendMail(message, (err, info) => {
      if (err) {
          console.log('Error occurred. ' + err.message);
          return process.exit(1);
      }
      console.log(JSON.stringify(info));
      transporter.close();
  });

}

function testmail(email, firstName, lastName, subject, body, htmlBody) {

  nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    // Message object
    let message = {
        from: 'NO_REPLY <no-reply@hpcompost.com>',
        to: firstName + ' ' + lastName +  '<' + email + '>',
        subject: String(subject),
        text: String(body),
        html: String(htmlBody)
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});

}

module.exports = router;
