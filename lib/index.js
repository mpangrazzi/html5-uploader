
/**
 * Module dependencies
 */

var util = require('util');
var EE3 = require('eventemitter3').EventEmitter;

var UploadError = require('./errors/upload-error');

module.exports = Uploader;


// uploader

function Uploader(options) {

  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }

  this.$el = this._getElement(options.el);
  this._elType = this.$el.tagName.toLowerCase();

  //

  if (options.name && typeof options.name !== 'string') {
    throw new TypeError('options `name` must be a string');
  }

  if (options.url && typeof options.url !== 'string') {
    throw new TypeError('options `url` must be a string');
  }

  if (options.method && typeof options.method !== 'string') {
    throw new TypeError('options `method` must be a string');
  }

  //

  this.files = [];
  this.method = options.method || 'POST';
  this.name = options.name || 'file';
  this.url = options.url || null;

  // EE3

  EE3.call(this);

  // error listener

  this.on('error', this._onError.bind(this));

  // check support

  this._checkSupport();

  // attach to $el

  this._attach();

}
util.inherits(Uploader, EE3);


Uploader.prototype._checkSupport = function() {

  if (typeof FileReader == 'undefined') {
    return this.emit('error', new Error('FileReader API not available'));
  }

  if (!window.FormData) {
    return this.emit('error', new Error('FormData API not available'));
  }

  this.support = {
    progress: 'upload' in new XMLHttpRequest(),
    draggable: 'draggable' in document.createElement('span')
  };

};


Uploader.prototype._onError = function(err) {
  if (this.listeners('error').length === 1) throw err;
};


Uploader.prototype._getElement = function(el) {
  var $el = null;

  if (typeof el === 'object') {
    if (el.nodeName) {
      $el = el;
    } else {
      throw new TypeError('option `el` is not a DOM element');
    }
  }
  else if (typeof el === 'string') {
    $el = document.querySelector(el);
    if (!$el) throw new Error('options `el` must be an existent DOM element reference');
  }
  else throw new TypeError('option `el` is invalid');

  return $el;
};


Uploader.prototype._attach = function() {
  var self = this;

  // generic drag event handler

  function handleDragEvents(e) {
    e.stopPropagation();
    e.preventDefault();
    return this.emit(e.type, e);
  }

  // check element type and attach

  if (this._elType === 'input') {

    // input

    if (this.$el.type !== 'file') {
      return this.emit('error',
        new Error('you should attach Uploader to an <input type="file"> tag'));
    }

    this.$el.onchange = function() {
      self._read(this.files);
    };

  } else {

    if (this.support.draggable) {

      // div (drag/drop)

      this.$el.ondragover = handleDragEvents.bind(this);
      this.$el.ondragleave = handleDragEvents.bind(this);
      this.$el.ondragstart = handleDragEvents.bind(this);
      this.$el.ondragend = handleDragEvents.bind(this);

      this.$el.ondrop = function(e) {
        e.stopPropagation();
        e.preventDefault();

        self.emit('drop', e);
        self._read(e.dataTransfer.files);
      };

    } else {

      // If drag/drop is not supported, we can't read files.
      // We need an <input> tag

      this.emit('error', new Error('drag and drop events are not supported. \
        You should attach Uploader to an <input> tag'));
    }

  }
};


Uploader.prototype._read = function(files) {
  if (!files) files = this.$el.files || this.files;
  if (!files || files.length === 0) return this.emit('error', new Error('No files to upload'));

  // clear previously selected files

  if (this.files.length > 0) this.files = [];

  // read files and build FormData

  this.formData = new FormData();

  var i;

  for (i = 0; i < files.length; i++) {
    this.files.push(files[i]);
    this.formData.append(this.name, this.files[i]);
  }

  this.emit('files:added', this.files);

  // preview

  for (i = 0; i < files.length; i++) {
    this._preview(files[i]);
  }

};


Uploader.prototype._preview = function(file) {
  var self = this;
  var reader = new FileReader();

  if (file.type.indexOf('image/') === 0) {

    // image

    reader.onload = function(event) {
      var img = new Image();

      img.onload = function() {
        self.emit('file:preview', file, img);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);

  } else {

    // non-image

    this.emit('file:preview', file);
  }
};


Uploader.prototype._upload = function() {
  var self = this;

  // checks

  if (this.files.length === 0) {
    return this.emit('error', new UploadError('No files to upload'));
  }

  if (!this.url) {
    return this.emit('error', new UploadError('No `url` option specified'));
  }

  // upload

  var xhr = new XMLHttpRequest();
  xhr.open(this.method.toUpperCase(), this.url);

  xhr.onerror = function() {
    var message = this.statusText || 'upload failed';
    self.emit('error', new UploadError(message, this.status));
  };

  xhr.onload = function() {

    if (this.status === 200) {
      self.emit('upload:done', this.response);
    } else {
      self.emit('error', new UploadError(this.response, this.status));
    }

  };

  // progress

  if (this.support.progress) {

    xhr.upload.onprogress = function(event) {

      if (event.lengthComputable) {
        var progress = (event.loaded / event.total * 100 | 0);
        self.emit('upload:progress', progress);
      }

    };

  }

  // upload previously populated formData

  xhr.send(this.formData);
};


Uploader.prototype.upload = function() {
  this._upload();
  return true;
};


Uploader.prototype.getFiles = function() {
  return this.files;
};


Uploader.prototype.clearFiles = function() {
  this.files = [];
  return this.emit('files:cleared');
};
