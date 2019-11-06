var express = require('express');
var router = express.Router();
var path = require("path");

if(process.env.NODE_ENV === 'production') {
  router.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '/../client/build', 'index.html'));
  });
}
else {
  router.get('/', (req, res) => {  
    res.sendFile(path.join(__dirname+'/../client/public/index.html'));
  });
}

module.exports = router;
