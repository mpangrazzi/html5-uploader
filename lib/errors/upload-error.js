var util = require('util');

module.exports = UploadError;


function UploadError(message, status) {
  Error.call(this);
  this.message = message;
  this.status = status || null;
}
util.inherits(UploadError, Error);
