module.exports = class ListItem {
  constructor(fullUrl, author) {
    this.name = this.convertUriToName(fullUrl);
    this.url = fullUrl.trim();
    this.tags = [author]
  }
  
  convertUriToName(uri) {
      const uriEndsWithSlash = uri.endsWith('/') || uri.endsWith('/?');
      let splitTheUri = uri.split('/');
      const indexOfAddressFromEnd = (uriEndsWithSlash) ? 3 : 2;
      let name = splitTheUri[splitTheUri.length - indexOfAddressFromEnd];
      name = name.split('-').join(' ');
      return name;
  }
}