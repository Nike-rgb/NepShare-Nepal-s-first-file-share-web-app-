const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//setting up the server
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

//serving static Files
app.use(express.static('./public'));

//setting up the views
app.set('views', './resources/views');
app.set('view engine', 'ejs');

//setting up the database
mongoose.connect('mongodb+srv://nike:nike@cluster1.vr80o.gcp.mongodb.net/NepShare?retryWrites=true&w=majority', {
  useUnifiedTopology : true,
  useNewUrlParser : true,
  useCreateIndex : true
}).then(() => {
  console.log("Connection with the database made");
}).catch(() => {
  console.log("Connection failed");
});

//parsing the json req body and application/www-url-encoded
app.use(express.json());
app.use(express.urlencoded({extended : true,}));

//binding the evenEmitter with the app object
const Emitter = require('events');
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

//setting up the socket functions
require('./controllers/socketController.js')(server);

//routes
app.get('/', (req, res) => {
  res.render('index');
});

//file upload api
app.use('/api/file-upload', require('./resources/routes/api/uploadApi.js'));

//file download page
app.use('/files', require('./resources/routes/web/downloadPage.js'));

//file download api
app.use('/files/download', require('./resources/routes/api/downloadApi.js'));

//send-email api
app.use('/files/sendLink', require('./resources/routes/api/sendEmailApi.js'));
