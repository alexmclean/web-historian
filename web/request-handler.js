var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var http = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === "GET"){
    var parsedURL = url.parse(req.url);
    console.log(parsedURL);
    //res.writeHead()
    fs.readFile('./public/index.html', function (err, data) {
      if (err) throw err;
      console.log(data);
      http.serveAssets(res, data);
    });

  } else if(req.method === "POST"){
    console.log(archive.paths.list);
    var writer = fs.createWriteStream(archive.paths.list, {flags:'a'});
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });

    req.on('end', function(){
      console.log(data);
      writer.write(data);
      http.handleResponse(res, 200, data);
    });

  } else {
    res.end(archive.paths.list);
  }
};
