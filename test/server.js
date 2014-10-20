
/**
 * Module dependencies
 */

var express = require('express');
var fs = require('fs');
var path = require('path');
var multer = require('multer');


// test server

var app = express();

app.use(express.static(path.join(__dirname, './public')));

app.get('/', function(req, res) {
  var index = path.join(__dirname, './index.html');
  fs.createReadStream(index).pipe(res);
});

app.post('/upload', function(req, res) {
  res.json({ status: 'ok'});
});

app.listen(3000, function() {
  console.log('Test server listening on port 3000');
});
