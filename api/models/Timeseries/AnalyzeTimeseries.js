/*
 * AnalyzeTimeseries
 * 
 * Takes a list of Analysis objects and applies them to a Timeseries List.
 * 
 * Rather than repeat it inside each Analysis object, the overview of
 * Analysis objects is here, along with how they are used.
 * 
 * There are two different Analysis types, and four function types.
 * The types are 'local' and 'gobal'.  A 'local' Analysis is performed
 * on a single Timeseries.  A 'global' Analysis compares multiple
 * Timeseries in a list.
 * 
 * The function types:
 *   'start': Initialize the keys that will be added to the Timeseries.
 *      Only gets one parameter, the Timeseries.
 *   'daily': Gets called on each day of the Timeseries.  Generally updates
 *      one or more keys in the Timeseries.  Gets two parameters, a 'day'
 *      structure and a Timeseries.
 *   'stop': Perform final calculations and remove keys from the Timeseries 
 *      that are not desired.  Only gets one parameter, the Timeseries.
 *   'global': Run after all Analysis objects have completed the start->
 *      daily->stop loops.  Only gets one parameter, a list of Timeseries.
 * 
 * Note that a single analysis can and will contain both 'local' and 
 *   'global' function types.  This is a simplification of the more general
 *    map-reduce model, with the 'global' stage acting as the reducer.
 * 
 * The 'day' structure is a simple hash table with the same keys as the
 *   'daily' section of the Timeseries (documented in Timeseries.js), but 
 *   rather than an array for each of 'open', 'close' etc there is a single 
 *   value.  This protects the Analysis objects from the details of how
 *   their data is stored in the Timeseries.  That is necessary because
 *   right now that structure is closely tied to the Plotly graphing library,
 *   and would probably change if the graphing library changed.
 */

 // Used for 'stop' functions.  Could also be used for 'start' functions.
function ApplyFunctionListToTimeseries (timeseries, functionList) {
    for (var f in functionList) {
        functionList[f](timeseries);
    };
};

// Used for the 'daily' function.
function ApplyDailyListToTimeseries (timeseries, functionList) {
    for (var dayIndex in timeseries.daily.time) {
        day = {
            time: timeseries.daily.time[dayIndex],
            open: timeseries.daily.open[dayIndex],
            high: timeseries.daily.high[dayIndex],
            low: timeseries.daily.low[dayIndex],
            close: timeseries.daily.close[dayIndex],
            volume: timeseries.daily.volume[dayIndex]
        };
  
        for (var f in functionList) {
            functionList[f](day, timeseries);
        };
    };
};

/*
 * AnalyzeTimeseries
 * 
 * AnalyzeTimeseries takes an Analysis Set and applies it to a single Timeseries.
 * 
 * Each Analysis may or may not have a function of each type.  For a given Analysis, 
 * the order of execution is 'start' called once, then 'daily' called once for each
 * trading day, then 'stop' called once.  
 * 
 * We only want to create a 'day' object once for each day, though, which means that
 * we compile a list of 'daily' functions to iterate through with each 'day' object.
 * While doing that, we also make a list of 'stop' functions.  We could do the same
 * with 'start' functions, but there's no reason to.  Every time we detect one we
 * can just run it in place, as order of execution doesn't matter between different
 * 'start' functions.
 */
function AnalyzeTimeseries (timeseries, analysisList) {
    var dailyList = [];
    var stopList = [];
    for (var aIndex in analysisList) {
        var analysis = analysisList[aIndex];

        if ('start' in analysis) {
            analysis.start(timeseries);
        }
        if ('daily' in analysis) {
            dailyList.push(analysis.daily);
        }
        if ('stop' in analysis) {
            stopList.push(analysis.stop);
        }
    }
    ApplyDailyListToTimeseries(timeseries, dailyList);
    ApplyFunctionListToTimeseries(timeseries, stopList);
};

/*
 * This is the only function that operates on multiple Timeseries.  Once we have a few
 * more functions like this, we will collect them in a new Timeseries Container object.
 * For now that is https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it
 * 
 * The important point is, it doesn't quite fit.  We take note of that and move on.
 */
module.exports.AnalyzeTimeseriesList = function (timeseriesList, analysisList) {
    // First run all local functions
    for (var tIndex in timeseriesList) {
        AnalyzeTimeseries(timeseriesList[tIndex], analysisList);
    }
    // Now run all global functions
    for (var aIndex in analysisList) {
        var analysis = analysisList[aIndex];
        if ('global' in analysis) {
            analysis.global(timeseriesList);
        };
    };
};
