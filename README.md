LimeLight CRM API
=========

A small library providing utility methods to `request` LimeLight CRM API

## Installation

  npm install limelight-crm-api --save

## Usage
  var LimeLight = require("limelight-crm-api");
  var limelight = new LimeLight({
    url: 'https://www.yourlimelightserver.com/admin/',
    user: 'username',
    pass: 'secretpass'
  });
  limelight.request('membership', 'order_view', {
    order_id: 99999
  })
    .then(function(data) {
      console.log('Server responded with: ', data);
    })
    .catch(function(err) {
      console.error('Error: ', err);
    });

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.

## Release History

* 1.0.0 Initial release
