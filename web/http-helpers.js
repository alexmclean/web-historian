var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');


exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, contentType, statusCode, callback) {
  statusCode = statusCode || 200;
  fs.readFile(asset, 'utf8', function (err, assetData) {
    if (err) throw err;
    headers['Content-Type'] = contentType;
    res.writeHead(statusCode, headers);
    res.write(assetData);
    res.end();
  });
};

exports.handleResponse = function(response, statusCode, data, location){
  if(location){
    headers["Location"] = location;
    headers["Content-Type"] = "text/html";
  }
  response.writeHead(statusCode, headers);
  response.write(data);
  response.end();
};

exports.serveIndex = function(response, filePath){
  fs.readFile(archive.paths.siteAssets + "/index.html", 'utf8', function (err, indexData) {
    if (err) throw err;
    exports.serveAssets(response, indexData);
  });
};

exports.getData = function(req, callback){
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function(){
    callback(data);
  });
};

// As you progress, keep thinking about what helper functions you can put here!
