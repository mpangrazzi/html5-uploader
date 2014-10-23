HTML5 uploader
==============

The purpose of this library is to help users building **heavily customized**, **pure-HTML5** JavaScript file uploaders with ease.


## Features

- Works well with [Browserify](http://browserify.org), but [standalone](http://www.forbeslindesay.co.uk/post/46324645400/standalone-browserify-builds) builds are provided, so you can use it with loaders like [AMD](http://requirejs.org/docs/whyamd.html#amd) or globally (see below)
- Event-based (using the _only one_ dependency, [EventEmitter3](https://github.com/primus/EventEmitter3))
- Can be attached to classic input tags or divs (to do Drag & Drop upload)
- No jQuery (or whatever) dependencies


## Install

#### Browserify

Install with [npm](https://www.npmjs.org):

```
npm install html5-uploader
```

Then, simply `require` this package:

```js
var Uploader = require('html5-uploader');

var uploader = new Uploader({
  el: '#uploader',
  ...
});
```


#### Global

Use the **standalone** build:

```html

<html>
<head>
  ...
</head>
<body>
  ...

  <div id="uploader"></div>

  <script src="html5-uploader.min.js"></script>
  <script type="text/javascript">

    var uploader = new Uploader({
      el: '#uploader',
      ...
    });

    ...

  </script>
</body>
</html>
```

#### RequireJS / CommonJS / SES

It's very straighforward. Have a look at [this great blog post](http://www.forbeslindesay.co.uk/post/46324645400/standalone-browserify-builds) about using Browserify standalone builds.


## Examples

I **strongly** recommend to clone this repo and launch the examples server. Simply run npm `dev` task:

```
npm run dev
```

Then open `http://localhost:3000` and take a look at the code on `/examples` folder.

Alternatively, you can view them on [http://mpangrazzi.github.io](http://mpangrazzi.github.io) (note that upload is _disabled_, and source code is already _browserified_).


## Events

#### "files:added"

Fired when one or more files are added to `Uploader` instance.

You can also have access to underlying **FormData** object here, which already contains your file. So, you can easily append other fields, if you want.

```js
uploader.on('files:added', function(files) {

  /**
   * Here you have files, so you can perform validations, UI changes, ...
   */
  
  /**
   * Appending a sample field to underlying FormData object
   */
  
  this.formData.append('sample', 'test');
  
});
```

#### "file:preview"

Fired once for every file added. 

If the file matches `image/*` mime type it's readed using [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) API and `$img` (a DOM image element) is provided on event handler.

```js
uploader.on('file:preview', function(file, $img) {

  /**
   * Here you can populate a preview template with `file` or `$img`.
   * For example:
   */
  
  if ($img) {
    var $preview = document.getElementById('#preview');
    div.appendChild($img);
  }
  
});
```

#### "files:cleared"

Fired when .clearFiles() public method is called.

```js
uploader.on('files:cleared', function() {

  /**
   * Here you may clear your #preview element
   */
  
});
```

#### "upload:progress"

If upload progress support is available in `XMLHttpRequest`, then this event is fired every time progress changes.

```js
uploader.on('upload:progress', function(progress) {

  /**
   * `progress` is a Number between 0 and 100.
   * 
   * Here you can, for example, increment a progress bar.
   */
  
});
```

#### "upload:done"

Fired when files upload is done.

```js
uploader.on('upload:done', function(response) {

  /**
   * `response` is the server response, returned as a String
   * 
   * Here you can, for example, notify the user.
   */
  
});
```

#### "error"

Fired when an error occurs (e.g. upload failed). I strongly recommend to add a listener on this event.

```js
uploader.on('error', function(err) {

  /**
   * `err` is an Error instance. 
   * 
   * If there's an error during upload, `err` will also have a `status` 
   * property containing the HTTP status code received from server
   */

  if (err.status) console.error(err.status);
  console.error(err.message);

});
```

#### "dragover", "dragleave", "dragstart", "dragend"

If you have attached Uploader to a `<div>`, you can listen to those events to do some fancy UI changes.


## Tests

To launch tests, simply run:

```
npm test
```

Then open `http://localhost:3000` to see the report.


## Documentation

### Initialization options

```js
var uploader = new Uploader({ ... });
```

`Uploader` available options are:

- `el`: **required**. Can be a DOM reference or a CSS selector. Supported tags are `<input type="file">` (classic file input) or a `<div>` (for drag & drop).
- `name`: Name of the FormData param used for upload. Default: `file`.
- `url`: URL of your server-side upload API endpoint. If omitted, calling upload() will throw or emit and error.
- `method`: Request method used during upload. Default: `POST`.


### Public methods

##### .upload()

Upload all the files to specified endpoint, using HTML5 [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

Be sure to have a listener on `upload:progress`, `upload:done` and `error` events before calling this method.

##### .getFiles()

Returns a [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList) with current files.

##### .clearFiles()

Clear current files.


### How to build

Be sure to install dev dependencies using `npm install`. [Browserify](http://browserify.org) and [npm scripts](https://www.npmjs.org/doc/misc/npm-scripts.html) are used for build system.

- `npm run build` will build a **standalone**, **non-minified** version
- `npm run build-min` will build a **standalone**, **minified** version

Also:

- `npm run dev` is useful for development. Launch an examples server, watch for changes, and automatically rebuild all if needed.


## Browser Support

It will work where [File](https://developer.mozilla.org/en-US/docs/Web/API/File) and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) API are supported.

- Chrome **7+**
- Firefox **4+**
- IE **10+**
- Opera **12+**
- Safari **6+**

You can find more info about API support on [caniuse.com](http://caniuse.com/#search=filereader).
