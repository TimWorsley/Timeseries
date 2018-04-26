var assert = require('assert');
var ts = require('../../../api/models/Timeseries');
var aSet = require('../../../api/models/Timeseries/AnalysisSet');
var at = require('../../../api/models/Timeseries/AnalyzeTimeseries');

describe('Timeseries', function() {
    this.timeout(20000);
    var hash1 = ts.CreateTimeseries('2015-01-01', '2015-02-01', 'IBM');
    var hash2 = ts.CreateTimeseries('2015-02-01', '2015-01-01', 'IBM');
    var hash3 = ts.CreateTimeseries('2015-01-01', '2015-02-01', 'WMT');
    describe('Creation', function() {
        it('returns the same value regardless of the order of start and end times', function() {
            assert.deepStrictEqual(hash1, hash2);
        });
        it('throws an error if given an invalid start or end time', function() {
            assert.throws( function() {
                ts.CreateTimeseries('2015-01-01', 'This is not a valid date string format', 'IBM');
            }, Error);
            assert.throws( function() {
                ts.CreateTimeseries('This is not a valid date string format', '2015-01-01', 'IBM');
            }, Error);
            assert.throws( function() {
                ts.CreateTimeseries('This is not a valid date string format', 'This is also not a valid date string format', 'IBM');
            }, Error);
        });
        it('throws an error if given an invalid symbol', function() {
            assert.throws( function() {
                ts.CreateTimeseries('2015-01-01', '2015-02-01', '1');
            }, Error);
        });
    });
    describe('Analysis', function() {
        at.AnalyzeTimeseriesList([hash1, hash3], aSet.basicList);
        at.AnalyzeTimeseriesList([hash2, hash3], aSet.basicList);
        it('can find the best day', function() {
            assert.equal(hash1.bestDay, '2015-01-29');
        });
        it('can calculate correct average volume', function() {
            assert.equal(hash1.averageVolume, 5869793.05);
        });
        it('can calculate correct number of days down', function() {
            assert.equal(hash1.losingDays, 11);
        });
        it('can assign the biggest loser', function() {
            assert.equal(hash1.hasMostLosingDays, 'true');
        });
        it('can calculate the monthly open average correctly', function() {
            assert.equal(hash1.monthly.averageOpen[0], 140.30979584711048);
        });
        it('can calculate the monthly close average correctly', function() {
            assert.equal(hash1.monthly.averageClose[0], 140.1625233864855);
        });
    });
});