module.exports = {
  mode : "development",
  entry : {
    "js" : './resources/js/js.js',
    "download" : './resources/js/download.js',
    "socket.io" : './resources/js/socket.io',
  },

  devtool : 'inline-source-map',

  output : {
    path : __dirname + '/public/js',
    filename : '[name].js',
  }
}
