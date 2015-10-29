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

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  res.writeHead(200, headers);
  res.write(asset);
  res.end();
};

exports.handleResponse = function(response, statusCode, data){
  response.writeHead(statusCode, headers);
  response.write(data);
  response.end();
};

exports.serveIndex = function(response){
  fs.readFile(archive.paths.siteAssets + "/index.html", 'utf8', function (err, indexData) {
    if (err) throw err;
    exports.serveAssets(response, indexData);
  });
}
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

// As you progress, keep thinking about what helper functions you can put here!
