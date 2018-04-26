/* 
 * AnalysisSet
 * 
 * This is where we tie together the Analysis that we want to make available to each application.
 * Since right now there is only one application, it's skeletal.  The idea is that each application
 * would have a file like this, at least until overlap between applications makes it clear which
 * types of Analysis are general and which are application specific.  Once we know that, we can group
 * the general Analysis set together to avoid it being repeated in each application.
 *
 * Each Analysis object comes from its own file, and an Analysis Set is just a list of Analysis objects.
 */

var bestDay = require('./BestDay');
var monthlyAverages = require('./MonthlyAverages');
var averageVolume = require('./AverageVolume');
var losingDayCount = require('./LosingDayCount');

module.exports.basicList = [ bestDay.BestDay, monthlyAverages.MonthlyAverages, averageVolume.AverageVolume, losingDayCount.LosingDayCount ];

