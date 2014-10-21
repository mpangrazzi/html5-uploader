
/**
 * Module dependencies
 */

var Uploader = require('../lib');
var template = require('underscore').template;
var humanize = require('humanize');

module.exports = function() {

  var $preview = document.querySelector('#input-multiple-preview');

  var multiple = new Uploader({
    el: '#input-multiple',
    url: '/upload'
  });

  var t = template('<p> \
    name: <strong><%= name %></strong> \
    type: <strong><%= type %></strong> \
    size: <strong><%= size %></strong> \
  </p>');

  multiple.on('files:added', function() {

    while ($preview.firstChild) {
      $preview.removeChild($preview.firstChild);
    }

    // this.upload();
    console.log('Upload is disabled. Clone mpangrazzi/html5-uploader and uncomment it on examples/multiple.js!');
  });

  multiple.on('file:preview', function(file, $img) {

    if ($img) {

      $img.style.maxWidth = '100%';
      $img.style.maxHeight = '100%';

      $preview.appendChild($img);

    } else {

      var html = t({
        name: file.name,
        size: humanize.filesize(file.size),
        type: file.type || 'unknown'
      });

      $preview.innerHTML += html;

    }

  });

  multiple.on('upload:progress', function(progress) {
    console.log('progress: %s', progress);
  });

  multiple.on('upload:done', function(progress) {
    console.log('uploaded');
  });

  multiple.on('error', function(err) {
    console.error(err.message);
  });

};
