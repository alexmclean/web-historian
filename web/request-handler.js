var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var http = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === "GET"){
    var parsedURL = url.parse(req.url);
    //if(parsedURL.pathname === '/'){
      http.serveIndex(res);
    //}

  } else if(req.method === "POST"){
    
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });

    req.on('end', function(){
      archive.addUrlToList(data, function(x){return x;});
      http.handleResponse(res, 201, data);
    });

  } else {
    res.end(archive.paths.list);
  }
};
