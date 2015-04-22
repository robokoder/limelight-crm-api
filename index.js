'use strict';


var Promise = require('bluebird')
  , request = require('request')
  , queryString = require('querystring')
  , limelightConfig
  ;


/**
 * options
 * @url  - your LimeLight API admin URL
 * @user - your LimeLight API username
 * @pass - your LimeLight API password
 */
function LimeLightCRM(options) {
  if (options.url !== undefined && options.credentials !== undefined) {
    if (Array.isArray(options.credentials)) {
      limelightConfig = options;
      limelightConfig.credentialsIterator = 0;
    } else {
      throw new Error("Expected an array of credentials, got " + (typeof options.credentials));
    }
  } else {
    throw new Error('Expected an array of objects with "url" and "credentials" attributes');
  }
}

/**
 * options
 * @type    - type of the LimeLight API - TRANSACTION | MEMBERSHIP
 * @method  - LimeLight method to run
 * @params  - object with params to be passed to LimeLight method
 */
LimeLightCRM.prototype.request = function(type, method, params) {
  var i = limelightConfig.credentialsIterator;
  return new Promise(function (resolve, reject) {
    var queryParams = {
      username: limelightConfig.credentials[i].user, password: limelightConfig.credentials[i].password, method: method
    };
    if (params !== undefined && Object.keys(params).length !== 0) {
      for (var property in params) {
        if (params.hasOwnProperty(property)) {
          queryParams[property] = params[property];
        }
      }
    }

    var options = {
      url: limelightConfig.url + type.toLowerCase() + '.php'
      ,
      qs: queryParams
    };

    if (limelightConfig.credentialsIterator < limelightConfig.credentials.length-1) {
      limelightConfig.credentialsIterator++;
    } else {
      limelightConfig.credentialsIterator = 0;
    }

    request.post(options, function (err, httpResponse, body) {
      if (err) {
        reject(err);
      }
      resolve(queryString.parse(body));
    });
  });
};

module.exports = LimeLightCRM;
