
var express = require('express');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var util = require('util');

var app = express();

app.use(multer({ dest: path.join(__dirname, './public/uploads') }));

app.use(express.static(path.join(__dirname, './public')));

app.get('/', function(req, res) {
  fs.createReadStream(path.join(__dirname, './index.html')).pipe(res);
});

app.post('/upload', function(req, res) {

  if (req.files) {

    if (util.isArray(req.files.file)) {

      req.files.file.forEach(function(file) {
        console.log('(multiple) %s', file.originalname);
      });

    } else {
      console.log('(single) %s', req.files.file.originalname);
    }

  }

  res.json({
    files: req.files.file,
    fields: req.body
  });

});

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
