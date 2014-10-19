
/**
 * Module dependencies
 */

var Uploader = require('../lib');
var template = require('underscore').template;
var humanize = require('humanize');

module.exports = function() {

  var $preview = document.querySelector('#dropbox-preview');

  var dropbox = new Uploader({
    el: '#dropbox',
    url: '/upload'
  });

  var t = template('<p> \
    name: <strong><%= name %></strong> \
    type: <strong><%= type %></strong> \
    size: <strong><%= size %></strong> \
  </p>');

  dropbox.on('dragover', function(e) {
    console.log(e);
  });

  dropbox.on('dragend', function(e) {
    console.log(e);
  });

  dropbox.on('files:added', function() {

    while ($preview.firstChild) {
      $preview.removeChild($preview.firstChild);
    }

    this.upload();
  });

  dropbox.on('file:preview', function(file, $img) {

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

  dropbox.on('upload:progress', function(progress) {
    console.log('progress: %s', progress);
  });

  dropbox.on('upload:done', function(progress) {
    console.log('uploaded');
  });

  dropbox.on('error', function(err) {
    console.error(err.message);
  });

};