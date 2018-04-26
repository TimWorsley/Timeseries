
This repository contains a Sails website that displays a single web page at http://localhost:1337
Entering a start time, end time and stock symbol list and clicking 'Display Data' will bring up
a report for each stock symbol in the list.  At the bottom of that report list will be a link to 
download a single JSON file containing all the data displayed on all reports.  Visual inspection
of that JSON benefits from tools like http://jsonprettyprint.com/

The overall functional flow is:
  User enters URL
    Website serves ./views/DefineTimeseries.ejs
  User enters data into the resulting web page and clicks 'Display Data'
    Website handles request at ./api/controllers/TimeseriesReportController.js
      which creates a list of Objects defined in ./api/models/Timeseries.js
        with actual network calls delegated to ./api/clients/QuandlClient.js
    This list of Timeseries objects then gets passed to:
      ./api/models/Timeseries/AnalyzeTimeseries.js
      to be modified by the Analysis objects defined in:
      ./api/models/Timeseries/AnalysisSet.js
    This modified data set is then passed to ./views/ReportList.ejs which in turn delegates to
      ./assets/js/RenderReport.js for report rendering.

For installation instructions, see INSTALL.txt



