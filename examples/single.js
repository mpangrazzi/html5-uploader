
/**
 * Module dependencies
 */

var Uploader = require('../lib');
var template = require('underscore').template;
var humanize = require('humanize');


// single file

module.exports = function() {

  var $preview = document.querySelector('#input-single-preview');

  var single = new Uploader({
    el: '#input-single',
    url: '/upload'
  });

  var t = template('<p> \
    name: <strong><%= name %></strong> \
    type: <strong><%= type %></strong> \
    size: <strong><%= size %></strong> \
  </p>');

  single.on('files:added', function() {

    while ($preview.firstChild) {
      $preview.removeChild($preview.firstChild);
    }

    this.upload();
  });

  single.on('file:preview', function(file, $img) {

    if ($img) {

      $img.style.maxWidth = '100%';
      $img.style.maxHeight = '100%';

      $preview.appendChild($img);

    } else {

      var html = t({
        name: file.name,
        size: humanize.filesize(file.size),
        type: file.type
      });

      $preview.innerHTML += html;

    }

  });

  single.on('upload:progress', function(progress) {
    console.log('progress: %s', progress);
  });

  single.on('upload:done', function(progress) {
    console.log('uploaded');
  });

  single.on('error', function(err) {
    console.error(err.message);
  });

};
