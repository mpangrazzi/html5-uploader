
/**
 * Module dependencies
 */

var Uploader = require('../lib');
var template = require('underscore').template;
var humanize = require('humanize');

module.exports = function() {

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
    this.$el.className = 'drop hover';
  });

  dropbox.on('dragleave', function(e) {
    this.$el.className = 'drop';
  });

  dropbox.on('dragend', function(e) {
    this.$el.className = 'drop';
  });

  dropbox.on('drop', function(e) {
    this.$el.className = 'drop';
  });

  dropbox.on('files:added', function() {

    while (this.$el.firstChild) {
      this.$el.removeChild(this.$el.firstChild);
    }

    // this.upload();
    console.log('Upload is disabled. Clone mpangrazzi/html5-uploader and uncomment it on examples/dropbox.js!');
  });

  dropbox.on('file:preview', function(file, $img) {

    if ($img) {

      $img.style.maxWidth = '100%';
      $img.style.maxHeight = '100%';

      this.$el.appendChild($img);

    } else {

      var html = t({
        name: file.name,
        size: humanize.filesize(file.size),
        type: file.type || 'unknown'
      });

      this.$el.innerHTML += html;

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
