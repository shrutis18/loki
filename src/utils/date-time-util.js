var moment = require('moment');

function DateTimeUtil(inputText) {
  var startsAt = extractDate(inputText).startDate + "T" + extractTime(inputText).startTime;
  var endsAt = extractDate(inputText).endDate + "T" + extractTime(inputText).endTime;

  function extractDate(inputText) {
    var datePattern = /(0?[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/g;
    var monthAndDate1 = inputText.match(datePattern)[0];
    var monthAndDate2 = inputText.match(datePattern)[1];

    var currentYear = moment().year();
    var startDate = `${currentYear}-${monthAndDate1}`;
    var endDate = `${currentYear}-${monthAndDate2}`;
    return {
      startDate: startDate,
      endDate: endDate
    }
  }

  function extractTime(inputText) {
    var timePattern = /(([0-1]?[0-9]:?([0-5]?[0-9])?)(\s*)(a|p)m)/ig;
    var startTime = timeStandardToMilitary(inputText.match(timePattern)[0]) + ":00Z";
    if((inputText.match(timePattern).length)>1){
    var endTime = timeStandardToMilitary(inputText.match(timePattern)[1]) + ":00Z";
    }
    return {
      startTime: startTime,
      endTime: endTime
    }
  }

  function timeStandardToMilitary(time) {
    return time.replace(/(\d{1,2})\s*:?\s*(\d{1,2})?\s*(am|pm)/gi, function (string, hour, minute, suffix) {
      minute = minute || '00';
      return (+hour + 11) % ((suffix.toLowerCase() == 'am') ? 12 : 24) + 1 + ':' + ((minute.length === 1) ? minute + '0' : minute);
    });
  }

  return {
  startsAt: startsAt,
  endsAt:endsAt
  };
}

module.exports = DateTimeUtil;
