/*
 * BestDay
 * 
 * Find the best day to trade in a given Timeseries, assuming you buy at the opening price 
 * and sell at the closing price.
 * 
 * Do this by adding two keys to the root level of the Timeseries:
 * Timeseries {
 *   bestDay: The 'key' of the best day found thus far, 
 *   x bestGain: The total profit of the best day found thus far
 * }
 * 
 * 'x' indicates that the key is deleted once BestDay completes
 */

function BestDayStart(ts) {   
    ts.bestDay = '';
    ts.bestGain = Number.MIN_VALUE;
}

function BestDayDaily(day, ts) {
    var gain = day.close - day.open;
    if (gain > ts.bestGain) {
        ts.bestDay = day.time;
        ts.bestGain = gain;
    }
}

function BestDayStop(ts) {
    delete ts['bestGain'];
}

module.exports.BestDay = {
    start: BestDayStart,
    stop: BestDayStop,
    daily: BestDayDaily
};



