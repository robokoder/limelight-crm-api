'use strict';


var Promise = require('bluebird')
  , request = require('request')
  , queryString = require('querystring')
  , limelightConfig
  , credentialsIterator = 0
  ;


/**
 * options
 * @url  - your LimeLight API admin URL
 * @user - your LimeLight API username
 * @pass - your LimeLight API password
 */
function LimeLightCRM(options) {
  if (Array.isArray(options)) {
    if (options.url !== undefined && options.user !== undefined && options.pass !== undefined) {
      limelightConfig = options;
    } else {
      throw new Error('Expected an array of objects with "url", "user" and "pass" attributes');
    }
  } else {
    throw new Error("Expected an array of objects, got " + (typeof options));
  }
}

/**
 * options
 * @type    - type of the LimeLight API - TRANSACTION | MEMBERSHIP
 * @method  - LimeLight method to run
 * @params  - object with params to be passed to LimeLight method
 */
LimeLightCRM.prototype.request = function(type, method, params) {
  return new Promise(function (resolve, reject) {
    var queryParams = {
      username: limelightConfig[credentialsIterator].user, password: limelightConfig[credentialsIterator].pass, method: method
    };
    if (params !== undefined && Object.keys(params).length !== 0) {
      for (var property in params) {
        if (params.hasOwnProperty(property)) {
          queryParams[property] = params[property];
        }
      }
    }

    var options = {
      url: limelightConfig[credentialsIterator].url + type.toLowerCase() + '.php'
      ,
      qs: queryParams
    };

    request.post(options, function (err, httpResponse, body) {
      if (err) {
        reject(err);
      }
      if (credentialsIterator < limelightConfig.length) {
        credentialsIterator++;
      } else {
        credentialsIterator = 0;
      }
      resolve(queryString.parse(body));
    });
  });
};

module.exports = LimeLightCRM;
