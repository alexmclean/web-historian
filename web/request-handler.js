var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var http = require('./http-helpers');
var fs = require('fs');
var query = require('querystring');
var _ = require('underscore');
// require more modules/folders here!

exports.paths = {
  '/': archive.paths.siteAssets + "/index.html",
  '/styles.css': archive.paths.siteAssets + "/styles.css",
  '/loading.html': archive.paths.siteAssets + "/loading.html"
}

exports.handleRequest = function (req, res) {
  if(req.method === "GET"){
    var parsedURL = url.parse(req.url);
    console.log(parsedURL.pathname);
    if(parsedURL.pathname === '/'){
      http.serveAssets(res, exports.paths[parsedURL.pathname], 'text/html');
    } else if(parsedURL.pathname === '/styles.css'){
      http.serveAssets(res, exports.paths[parsedURL.pathname], 'text/css');
    } else if(parsedURL.pathname === '/loading.html'){
      http.serveAssets(res, exports.paths[parsedURL.pathname], 'text/html');
    } else {
      fs.readdir(archive.paths.archivedSites, function(err, contents){
        console.log("contents ", _.contains(contents,parsedURL.pathname.slice(1)));
        console.log("address ", archive.paths.archivedSites + parsedURL.pathname);
        if(_.contains(contents, parsedURL.pathname.slice(1))){
          http.serveAssets(res, archive.paths.archivedSites + parsedURL.pathname, 'text/html'); 
        } else {
          http.handleResponse(res, 404, 'ERROR');
        }
      });
    }

  } else if(req.method === "POST"){
    
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });

    req.on('end', function(){
      var parsed = query.parse(data);
      console.log(parsed['url']);
      archive.addUrlToList(parsed['url'], function(x){return x;});
      http.handleResponse(res, 302, "redirected", 'http://127.0.0.1:3000/loading.html');
    });

  } else {
    res.end(archive.paths.list);
  }
};
