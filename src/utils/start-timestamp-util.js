var moment = require('moment');

function StartTimeStampUtil(inputText) {
  var startsAt = extractStartDate(inputText) + "T" + extractStartTime(inputText) + ".000Z";

  function extractStartDate(inputText) {
    var datePattern = /(0?[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/ig;
    var match = inputText.match(datePattern);
    var startDate = moment().year() + "-" + match[0];
    return startDate;
  }

  function extractStartTime(inputText) {
    var timePattern = /(([0-1]?[0-9]:?([0-5]?[0-9])?:?([0-5]?[0-9])?)(\s*)(a|p)m)/ig;
    var match = inputText.match(timePattern);
    var startTime = moment(match, ["h:mm:ss A"]).format('HH:mm:ss');
    return startTime;
  }
  return {
    startsAt: startsAt
  }
}
module.exports = StartTimeStampUtil;