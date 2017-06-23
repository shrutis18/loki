function NameUtil(inputText) {
  var roomName = extractName(inputText);

  function extractName(inputText) {
    var namePattern = /book[\s+](\w+([\s]room)?).*/i;
    var roomname = inputText.match(namePattern);
    return roomname[1].toLowerCase();
  }

  return {
    roomName :roomName 
  }
}
module.exports = NameUtil;