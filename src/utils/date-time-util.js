var moment = require('moment');

function DateTimeUtil(inputText) {
  var dateStamp = extractDate(inputText);
  var timeStamp = extractTime(inputText);

  var startsAt = dateStamp.startDate + "T" + timeStamp.startTime + ".000Z";
  var endsAt = dateStamp.endDate + "T" + timeStamp.endTime + ".000Z";

  function extractDate(inputText) {
    var datePattern = /(0?[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])|today|tomorrow/ig;

    var match = inputText.match(datePattern);
    var startDate;
    if (match == null || match[0].match(/today/ig)) {
      startDate = moment().format('YYYY-MM-DD');
    } else if (match[0].match(/tomorrow/ig)) {
      startDate = moment().add('days', 1).format('YYYY-MM-DD');
    } else if (match[0].match(/(0?[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/ig)) {
      startDate = moment().year() + "-" + match[0];
    }
    return {
      startDate: startDate,
      endDate: startDate
    }
  }

  function extractTime(inputText) {
    var timePattern = /(([0-1]?[0-9]:?([0-5]?[0-9])?)(\s*)(a|p)m)/ig;
    var timeMatch = inputText.match(timePattern);
    var startTime;
    var endTime;
    var tempStartTime;
    var duration;
    if (timeMatch == null) {
      startTime = moment();
    } else {
      startTime = moment(timeMatch, ["h:mm A"])
    }
    tempStartTime = startTime.clone();

    var durationPattern = /[1-9][\.]?[0-9]?[\s]+?(hours|hour|hrs|hr|minutes|mins)/ig;
    var durationMatch = inputText.match(durationPattern);
    if (durationMatch[0].match(/hours|hour|hrs|hr/ig)) {
      duration = durationMatch[0].match(/[1-9][\.]?[0-9]?/ig);
      endTime = tempStartTime.add(duration[0], 'hours');
    } else if (durationMatch[0].match(/minutes|mins/ig)) {
      duration = durationMatch[0].match(/[1-9][\.]?[0-9]?/ig)
      endTime = tempStartTime.add(duration[0], 'minutes');
    }
    return {
      startTime: startTime.format("HH:mm:ss"),
      endTime: endTime.format("HH:mm:ss")
    }
  }

  function isValidDate() {
    var currentDate = new Date(moment().format('YYYY-MM-DDThh:mm:ss'));
    var startsAtDate = new Date(moment(startsAt.slice(0, -1)).format('YYYY-MM-DDThh:mm:ss'));
    
    if (currentDate.getTime() <= startsAtDate.getTime()) {
      return true;
    } else {
      return false;
    }
  }
  return {
    startsAt: startsAt,
    endsAt: endsAt,
    isValidDate: isValidDate
  };
}

module.exports = DateTimeUtil;