
//var Plotly = require('plotly.js/dist/plotly');

var monthLastDay = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function debug_log(msg) {
    var debugId = document.getElementById('debug');
    debugId.innerHTML = debugId.innerHTML + msg + "<br>";
}

// Warning!  The dataset does not formally define what currency a given asset is priced in.
// That means there is no way at present to correctly render international assets.
function floatToDollarString(afloat) {
    return "$" + afloat.toFixed(2);
}

function getMonthNumberFromMonthString(monthStr) {
    var monthArray = monthStr.split('-');
    return monthArray[1];
}

function getBaseMonthShape(month) {
    var monthNumber = getMonthNumberFromMonthString(month.time);
    return {
        type: 'line',
        x0: month.time + '-01',
        x1: month.time + '-' + monthLastDay[parseInt(monthNumber)],
        line: {
            width: 2
        }
    }
}

function getMonthlyAverageShapes(ts) {
    var shapeList = [];
    for (var monthIndex in ts.months) {
        var month = ts.months[monthIndex];

        var avgOpenShape = getBaseMonthShape(month);
        avgOpenShape[y0] = month.averageOpen;
        avgOpenShape[y1] = month.averageOpen;
        avgOpenShape[line][color] = 'blue';
        shapeList.push(avgOpenShape);

        var avgCloseShape = getBaseMonthShape(month);
        avgCloseShape[y0] = month.averageClose;
        avgCloseShape[y1] = month.averageClose;
        avgCloseShape[line][color] = 'red';
        shapeList.push(avgCloseShape);
    }    
    return shapeList;
}

module.exports.render = function (reportId, volumeId, ts) {
// define base report
// add monthly lines
// add best day
// define volume report, while painting some values red
    sails.log.debug("render called");
    var reportData = {
        x: ts.daily.time,
        close: ts.daily.close,
        decreasing: {line: {color: '#7F7F7F'}},
        high: ts.daily.high,
        increasing: {line: {color: '#17BECF'}},
        line: {color: 'rgba(31,119,180,1)'},
        low: ts.daily.low,
        open: ts.daily.open,
        type: 'ohlc',
        xaxis: 'x',
        yaxis: 'y'        
    };
    var reportLayout = {
        title: '',
        dragmode: 'zoom', 
        margin: {
            r: 10, 
            t: 25, 
            b: 40, 
            l: 60
        }, 
        showlegend: false, 
        xaxis: {
            autorange: true, 
            rangeslider: {
		      visible: false
	        },
            title: 'Date', 
            type: 'date'
        }, 
        yaxis: {
            autorange: true, 
            type: 'linear'
        },
        shapes: getMonthlyAverageShapes(ts),
        annotations: [{
            x: ts.bestDay,
            y: 0.9,
            xref: 'x',
            yref: 'paper',
            text: 'largest gain',
            font: {color: 'magenta'},
            showarrow: true,
            xanchor: 'right',
            ax: -20,
            ay: 0
        }]
    };
    reportLayout.shapes.push({
        type: 'rect',
        xref: 'x',
        yref: 'paper',
        x0: ts.bestDay,
        y0: 0,
        x1: ts.bestDay,
        y1: 1,

        fillcolor: 'green',
        opacity: 0.2,
        line: {
            width: 3
        }            
    });
    debug_log("I don't think this works");
    Plotly.plot(reportId, reportData, reportLayout);

    var volumeData = {
        x: ts.daily.time,
        y: ts.daily.volume,
        marker: {
            color: []
        },
        type: 'bar'
    };
    var ca = volumeData['marker']['color'];
    var highVolume = ts.averageVolume * 1.1;
    for (var dayIndex in volumeData.x ) {
        if (volumeData.x[dayIndex] > highVolume) {
            ca.push('rgba(222,45,38,0.8)');
        } else {
            ca.push('rgba(204,204,204,1)');
        }
    }
//    var volumeData = [getVolumeData(key, reebo)];
    var prettyAverage = ts.averageVolume.toFixed(0);
    Plotly.plot(volumeId, [volumeData], {'title': ts.symbol + ' Volume, red for 10% above average of ' + prettyAverage});
};

