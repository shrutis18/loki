function NameUtil(inputText) {
  var roomName = extractName(inputText);

  function extractName(inputText) {
    var namePattern = /book\s([\s\w]+)\s[\d*]/i;
    var roomname = inputText.match(namePattern);
    return roomname;
  }

  return {
    roomName :roomName 
  }
}
module.exports = NameUtil;