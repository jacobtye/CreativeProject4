var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));
let docs = [];
let temp = "";
let currentFile = "";
let changed = false;
app.post('/saveDocument', (req, res) => {
    console.log("in post");
    console.log(req.body);
  let item = {
    name: req.body.name,
    text: req.body.text,
  };
  currentFile = req.body.name;
  docs.push(item);
  console.log(docs);
  res.send(item);
});
app.post('/saveTemp', (req, res) => {
    console.log("in post");
    console.log(req.body);
  temp = req.body.text;
  console.log(temp);
  this.changed = true;
  res.send(temp);
});
app.get('/getCurrFile', (req, res) => {
    console.log("in post");
    console.log(req.body);
  console.log(currentFile);
  res.send(currentFile);
});
app.get('/getTemp', (req,res) =>{
      console.log("in get");
    console.log(req.body);
  console.log(temp);
  res.send(temp);
});
app.get('/getDocuments', (req, res) => {
    console.log("in get");
    console.log(req.body);
  console.log(docs);
  res.send(docs);
});
app.get('/getChanged', (req, res) => {
    console.log("in get");
    console.log(req.body);
    console.log(this.changed);
  
  res.send(this.changed);
  if(this.changed){
    this.changed = false;
  }
});
app.put('/deleteFile', (req,res) => {
  console.log("IN DELETE");
  console.log(docs.length);
  res.send(docs.splice(req.body.index, 1));
  console.log(docs.length);
  console.log("DONE");
});
app.use('/', indexRouter);
console.log("here");
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
