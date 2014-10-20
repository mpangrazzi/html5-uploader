
/**
 * Module dependencies
 */


function mockFile() {
  return {
    name: 'filename',
    size: 2014,
    type: 'image/png'
  };
}


describe('Uploader', function() {

  it('Should exists in global scope', function() {
    window.Uploader.should.be.an.instanceof(Object);
  });


  it('Should throw if no options are passed', function() {
    (function() {
      new Uploader();
    }).should.throw('options must be an object');
  });


  it('Should throw if Uploader is attached to an invalid DOM element', function() {
    (function() {
      new Uploader({
        el: '#non-existent'
      });
    }).should.throw('options `el` must be an existent DOM element reference');
  });


  it('Should throw if Uploader is attached on <input> with type != file', function() {
    (function() {
      var $input = document.createElement('input');

      var uploader = new Uploader({
        el: $input
      });
    }).should.throw('you should attach Uploader to an <input type="file"> tag');
  });


  it('Should get an Uploader instance attached on div', function() {
    var $div = document.createElement('div');

    var uploader = new Uploader({
      el: $div
    });

    uploader.should.be.an.instanceof.Uploader;
  });


  it('Should get an Uploader instance attached on <input type="file">', function() {
    var $input = document.createElement('input');
    $input.type = 'file';

    var uploader = new Uploader({
      el: $input
    });

    uploader.should.be.an.instanceof(Uploader);
  });


  it('Should have defaults for method, name, url', function() {
    var $div = document.createElement('div');

    var uploader = new Uploader({
      el: $div
    });

    uploader.method.should.be.equal('POST');
    uploader.name.should.be.equal('file');
    Should(uploader.url === null).be.true;
  });


  it('Should override correctly method, name, url', function() {
    var $div = document.createElement('div');

    var uploader = new Uploader({
      el: $div,
      method: 'PUT',
      name: 'fileparam',
      url: '/upload'
    });

    uploader.method.should.be.equal('PUT');
    uploader.name.should.be.equal('fileparam');
    uploader.url.should.be.equal('/upload');
  });


  it('Should throw if upload() is called and no url is specified', function() {
    var $div = document.createElement('div');

    var uploader = new Uploader({
      el: $div,
      method: 'PUT',
      name: 'fileparam'
    });

    uploader.files.push(mockFile());

    (function() {
      uploader.upload();
    }).should.throw('No `url` option specified');
  });


  it('Should upload files with progress', function(done) {
    var $div = document.createElement('div');

    var uploader = new Uploader({
      el: $div,
      url: '/upload'
    });

    uploader.files.push(mockFile());

    uploader.on('upload:progress', function(progress) {
      progress.should.be.a.Number;
      progress.should.be.greaterThan(0);
      progress.should.not.be.above(100);
    });

    uploader.on('upload:done', function(res) {
      var data = JSON.parse(res);
      data.status.should.equal('ok');

      done();
    });

    uploader.upload();
  });

});
