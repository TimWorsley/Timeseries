/*
 * Timeseries
 * @description :: Fetch and manipulate timeseries data.  
 * Purpose is to encapsulate all Quandl-specific information, like the location 
 * and use of the 'day' array.
 *
 * Timeseries data manipulations are closely coupled to Timeseries data format.
 * To reflect this they are located in a Timeseries directory below this one.
 * 
 * Timeseries data is essentially the same format as Plotly graph data, as this
 * is the only existing consumer.  Once a second consumer is identified, an
 * appropriate abstraction can be made.
 * 
 * The Timeseries data structure is essentially a hash table of arrays.
 * Each key defines another data point that we track in the timeseries,
 * while each element in an array corresponds to a time for all data
 * points we track.  This means that if, say, 2017-03-04 is index 4 in the
 * "time" key's array, then index 4 in "close" would be the closing price
 * on that day, index 4 in "open" would be the opening price, and so on.
 * 
 * The structure of the Timeseries can be very clearly seen in the
 * function CreateEmptyTimeseries, so it will not be repeated here.
 */

var quandlClient = require('../clients/QuandlClient');

/* 
 * CreateEmptyTimeseries
 * 
 * Structure is as shown below.  A description of each element:
 *  time: Time is a YYYY-MM-DD formatted string.  The array contains only trading days in the order
 *     returned by Quandl, which is the order you would expect (normal calendar order)
 *  open, high, low, close: 
 *     all have the expected meaning, which is to say the prices in USD for that asset on the day.
 *     Note that, in Quandl terms, these are all 'adjusted' values, so consumers of Timeseries won't 
 *     have to worry about detecting stock splits and the like.
 *  volume: This is the pure volume of shares, expressed as a number.  So expected values would be
 *     1000000, and not 1M or 1,000,000 
 */
function CreateEmptyTimeseries(assetSymbol) {
  return {
    daily: {
      time: [], 
      open: [], 
      high: [],
      low: [],  
      close: [],
      volume: [] 
    },
    symbol: assetSymbol
  };
};

module.exports.CreateTimeseries = function (startTime, endTime, assetSymbol) {
  var startDate = Date.parse(startTime);
  var endDate = Date.parse(endTime);
  
  if (isNaN(startDate) || isNaN(endDate)) {
      throw new Error('Date format is incorrect');
  }
  
  if (endDate < startDate) {
  // Caller ignores instruction and enters dates in wrong order.  Not a problem, Fix That For You
      tmpTime = endTime;
      endTime = startTime;
      startTime = tmpTime;
  }
  var rawTimeseries = quandlClient.query(startTime, endTime, assetSymbol);
      var Timeseries = CreateEmptyTimeseries(assetSymbol);

      for (var dayIndex in rawTimeseries.dataset.data) {
        var day = rawTimeseries.dataset.data[dayIndex];
        Timeseries.daily.time.push(day[0]);
        Timeseries.daily.open.push(day[8]);
        Timeseries.daily.high.push(day[9]);
        Timeseries.daily.low.push(day[10]);
        Timeseries.daily.close.push(day[11]);
        Timeseries.daily.volume.push(day[12]);
      }
      return Timeseries;
};



