function TitleUtil(inputText) {
  var title = extracTitle(inputText);

  function extracTitle(inputText) {
    var titlePattern = /s[0-1]?[0-9]:?[0-5]?[0-9]?\s*^a|pm\s([\s\w]+)/ig;
    var title = inputText.match(titlePattern);
    return title
  }

  return {
    title :title 
  }
}
module.exports = TitleUtil;