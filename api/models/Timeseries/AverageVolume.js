/* 
 * AverageVolume
 * 
 * Calculate the average volume traded across a timeseries.
 * 
 * See Timeseries.js for an overview of function types
 * 
 * Add these keys to the root level of the Timeseries:
 * timeseries {
 *   totalVolume: A simply running tally of all volumes for all trading days in the Timeseries
 *   x totalDays: A simple running tally that is a count of the number of trading days in the Timeseries
 * }
 * 
 * An 'x' indicates a key that will be deleted once AverageVolume completes
 */

function AverageVolumeStart (ts) {
    ts.totalVolume = 0;
    ts.totalDays = 0;
};

function AverageVolumeDaily (day, ts) {
    ts.totalDays = ts.totalDays + 1;
    ts.totalVolume = ts.totalVolume + day.volume;
};

function AverageVolumeStop (ts) {
    ts.averageVolume = ts.totalVolume / ts.totalDays;
    delete ts['totalDays'];
};

module.exports.AverageVolume = {
    start: AverageVolumeStart,
    stop: AverageVolumeStop,
    daily: AverageVolumeDaily
};
