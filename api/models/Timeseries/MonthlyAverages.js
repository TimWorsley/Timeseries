/*
 * MonthlyAverages
 * 
 * See Timeseries.js for an overview of function types and how they get used.
 * 
 * Take a daily timeseries and create a per-month aggregated view.
 * Update that view with the average open and closing price within the month.
 * 
 * We do this by adding a new top level key to the timeseries, 'monthly'
 * (existing data is in top level key 'daily' so this is thematic)
 * The 'monthly' data format is the same as the 'daily' format in
 * general, in that it is a set of keys to arrays with each entry in the
 * array corresponding to a month.  
 * 
 * This is the structure for the 'monthly' root key:
 * monthly {
 *   time: The month name stored in a string of format YYYY-MM
 *   x totalOpen: A running total of all the opening values for the symbol in the month
 *   x totalClose: A running total of all the closing values for the symbol in the month
 *   x days: A running total of trading days in the month in the timeseries
 *   averageOpen: After the 'daily' function is completed, the 'stop' function will compute 
 *     the average opening values for the symbol for the month and put it here
 *   averageClose: As averageOpen, but for closing values
 *   x monthHash: This is NOT an array.  It is a hash.  Its use is documented in the 
 *     MonthlyAveragesDaily function
 * }
 * 
 * An 'x' indicates a key that is deleted when MonthlyAverages analysis has stopped
 * 
 */

function MonthlyAveragesStart(ts) {
    ts.monthly = {
        time: [],
        totalOpen: [],
        totalClose: [],
        days: [],
        averageOpen: [],
        averageClose: [],
        monthHash: {}
    }
};

// Here we take a date string of format YYYY-MM-DD and return one of format YYYY-MM
function GetMonthFromDate (dateString) {
    var dateArray = dateString.split('-');
    return dateArray[0] + '-' + dateArray[1];
};

/*
 * MonthlyAveragesDaily
 * 
 * Timeseries data is in the form of an array per data element type.  In theory the
 * calls to an analysis Daily function should be in order, but it is unwise to rely
 * on that completely.  To that end we use a 'monthHash' whose key is the YYYY-MM 
 * formatted month key and whose value is the array offset for that month.  That 
 * allows the Daily function to get called out of order without seriously scrambling
 * the output.
 * 
 */
function MonthlyAveragesDaily (day, ts) {
    var monthString = GetMonthFromDate(day.time);
    if (monthString in ts.monthly.monthHash) {
        // We have seen this month before, so this will be another trading day
        var index = ts.monthly.monthHash[monthString];
        ts.monthly.totalOpen[index] = ts.monthly.totalOpen[index] + day.open;
        ts.monthly.totalClose[index] = ts.monthly.totalClose[index] + day.close;
        ts.monthly.days[index] = ts.monthly.days[index] + 1;
    } else {
        // First trading day in the month that we have seen.

        // We will always put the next month at the end of the array.  This means
        // that the order of months in the .monthly section will be the same as the
        // order in which they appear in the Timeseries.
        ts.monthly.monthHash[monthString] = ts.monthly.time.length; 
        ts.monthly.time.push(monthString);
        ts.monthly.totalOpen.push(day.open);
        ts.monthly.totalClose.push(day.close);
        ts.monthly.days.push(1);
    }
};

// Take totals for open, close and days and calculate a simple average for each month
function MonthlyAveragesStop (ts) {
    for (var monthIndex in ts.monthly.time) {
        ts.monthly.averageOpen[monthIndex] = ts.monthly.totalOpen[monthIndex] / ts.monthly.days[monthIndex];
        ts.monthly.averageClose[monthIndex] = ts.monthly.totalClose[monthIndex] / ts.monthly.days[monthIndex]; 
    }
    var monthlyHash = ts.monthly;
    delete monthlyHash['monthHash'];
    delete monthlyHash['totalOpen'];
    delete monthlyHash['totalClose'];
    delete monthlyHash['days'];
};

module.exports.MonthlyAverages = {
    start: MonthlyAveragesStart,
    stop: MonthlyAveragesStop,
    daily: MonthlyAveragesDaily
};