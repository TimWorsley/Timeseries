/**
 * TimeseriesReportController
 *
 * The TimeseriesReportController takes input from the DefineTimeseries view, 
 * fetches a list of Timeseries objects, passes that to the AnalyzeTimeseries object
 * with the basic list of Analysis objects from the AnalysisSet object.  The resulting
 * data forms an array of Timeseries objects.  By framework convention, data is passed
 * on to the next 'ReportList' view as a hash table:
 * parameterPassingHashTable {
 *   timeseriesList: [
 *      Timeseries 1,
 *      Timeseries 2,
 *      ...
 *   ]
 * }
 * 
 * This order of execution is the only thing this Controller is directly responsible
 * 
 * Actual parameter validation is done in the Timeseries object.
 */

var timeseries = require('../models/Timeseries');
var analytics = require('../models/Timeseries/AnalysisSet');
var doAnalysis = require('../models/Timeseries/AnalyzeTimeseries');

module.exports.RequestTimeseriesReport = function (req, res) {
    var startDateString = req.param('start_date');
    var endDateString = req.param('end_date');

    var symbolListString = req.param('symbols');
    var symbolArray = symbolListString.split(',');

    var timeseriesList = [];
    for (var symbolPosition in symbolArray) {
        var symbol = symbolArray[symbolPosition];
        symbol = symbol.trim();
        timeseriesList.push(timeseries.CreateTimeseries(startDateString, endDateString, symbol));
    }

    doAnalysis.AnalyzeTimeseriesList(timeseriesList, analytics.basicList);

    return res.view('ReportList', { timeseriesList: timeseriesList });
};

