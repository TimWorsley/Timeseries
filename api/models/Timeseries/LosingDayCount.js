/*
 * LosingDayCount
 * 
 * For a timeseries, count how many days would lose money if you bought at the 
 * opening price and sold at the closing price.
 * 
 * With this information, add a tag to the timeseries in a set of timeseries that
 * has the largest number of losing days.  In the event of a tie, the first timeseries
 * in the list will get the tag.
 * 
 * keys added to the root of the Timeseries:
 * Timeseries {
 *   losingDays: a count of how many trading days in the Timeseries posted a loss
 *   hasMostLosingDays: a flag that would indicate that the Timeseries has the most
 *     losing days in its Timeseries List.
 * }
 * 
 * Note that there are consumers of both losingDays and hasMostLosingDays, so both
 *   are kept.
 */

function LosingDayCountStart (ts) {
    ts.losingDays = 0;
};

function LosingDayCountDaily (day, ts) {
    if (day.close < day.open) {
        ts.losingDays = ts.losingDays + 1;
    };
};

// We don't clean up losingDays because that information is also useful
function TagBiggestLoser (tsList) {
    var losingIndex = -1;
    var losingTotal = -1;
    for (var tsIndex in tsList) {
        var ts = tsList[tsIndex];
        if (ts.losingDays > losingTotal) {
            losingIndex = tsIndex;
            losingTotal = ts.losingDays;
        };
    };
    tsList[losingIndex].hasMostLosingDays = 'true';
};

module.exports.LosingDayCount = {
    start: LosingDayCountStart,
    daily: LosingDayCountDaily,
    global: TagBiggestLoser
};
