'use strict';


var Promise = require('bluebird')
  , request = require('request')
  , queryString = require('querystring')
  , limelightConfig = {}
  ;


/**
 * options
 * @url  - your LimeLight API admin URL
 * @user - your LimeLight API username
 * @pass - your LimeLight API password
 */
function LimeLightCRM(options) {
  limelightConfig.LIMELIGHTCRM_BASIC_ADMIN_URL  = options.url;
  limelightConfig.LIMELIGHTCRM_USERNAME         = options.user;
  limelightConfig.LIMELIGHTCRM_PASSWORD         = options.pass;
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
      username: limelightConfig.LIMELIGHTCRM_USERNAME, password: limelightConfig.LIMELIGHTCRM_PASSWORD, method: method
    };
    if (params !== undefined && Object.keys(params).length !== 0) {
      for (var property in params) {
        if (params.hasOwnProperty(property)) {
          queryParams[property] = params[property];
        }
      }
    }

    var options = {
      url: limelightConfig.LIMELIGHTCRM_BASIC_ADMIN_URL + type.toLowerCase() + '.php'
      ,
      qs: queryParams
    };

    request.post(options, function (err, httpResponse, body) {
      if (err) {
        reject(err);
      }
      resolve(queryString.parse(body));
    });
  });
};

module.exports = LimeLightCRM;
