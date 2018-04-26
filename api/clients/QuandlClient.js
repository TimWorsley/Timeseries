var request = require('sync-request');

var quandlConfig = require('../../config/quandl.js');
//import quandlApiKey from '../../config/quandl.js';

function buildUrl(startDate, endDate, symbol) {
    // Javascript lacks a native string format, so we build the URL one part at a time.
    var url = "https://www.quandl.com/api/v3/datasets/WIKI/";
    url = url + symbol;
    url = url + ".json?trim_start=" + startDate;
    url = url + "&trim_end=" + endDate;
    url = url + "&api_key=" + quandlConfig.quandlApiKey;

    return url;
};

function query(startDate, endDate, symbol) {
//    return new Promise(function(resolve, reject) {
      var url = buildUrl(startDate, endDate, symbol);
      var res = request('GET', url, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
//console.log(res.body.toString('utf-8'));
//    sails.log.debug(JSON.stringify(res.body.toString('utf-8')));
var resJson = res.body.toString('utf-8');
      resJson = JSON.parse(resJson);
    return resJson;
      //var request = new XMLHttpRequest();
//      request.open('GET', url, false);  // `false` makes the request synchronous
//      request.send(null);
      
//      if (request.status === 200) {// That's HTTP for 'ok'
//        return request.responseText.json();
//      }
//      fetch(url).then(response => response.json())
//      .then(json => resolve(json))
//    });

};

module.exports.query = query;
