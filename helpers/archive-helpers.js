var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpLib = require('http');
var httpHelpers = require('../web/http-helpers');
var reqHandler = require('../web/request-handler');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),

};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
    if (err) throw err;
    return callback(data.split("\n"));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls){
    return callback(_.contains(urls, url))
  });
};

exports.addUrlToList = function(data, callback) {
  var writer = fs.createWriteStream(exports.paths.list, {flags:'a'});
  writer.write(data + "\n");
  return callback(data);
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, urlArray){

    if(urlArray.indexOf(url) > -1){
      return callback(true);
    } else {
      return callback(false);
    }
  });
};

//http://stackoverflow.com/questions/5801453/in-node-js-express-how-do-i-download-a-page-and-gets-its-html
exports.downloadUrls = function(urlArray) {
  //for(var i = 0; i < urlArray.length; i++){
  _.each(urlArray, function(url){
    /*
    var webName = url;
    var options = {
      host: webName,
      port: 80 + i,
      path: '/index.html'
    };

    httpLib.get(options, function(res) {
      var website = webName;
      console.log("website: ", website);
      console.log("Got response: " + res.statusCode);
      httpHelpers.getData(res, function(data){
        fs.writeFile((exports.paths.archivedSites + '/' + website), data, 'utf8', function(err){
          console.log("/" + website);
          reqHandler.paths["/" + website] = exports.paths.archivedSites + '/' + website;
          console.log("wrote succesfully");
        });
      });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
*/
    if(!url){ return;}
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};
