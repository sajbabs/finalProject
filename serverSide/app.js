var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
const productRouter = require('./routes/products.js');
const courseRouter = require('./routes/courses.js');
const authorizeRouter = require('./routes/auth.js');
const jwtManager = require('./jwt/jwtManager');


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
  if (req.url === '/authorize') {
    console.log(req.url);
    next();
    return;
  }
  const header = req.headers.authorization;
  if (!header) {
    return res.json({status: 'auth_error'});
  } else {
    const jwt = new jwtManager();
    const data = jwt.verify(header.split(' ')[1]);
    console.log(data);
    if (!data) {
      return res.json({ status: 'auth_err' });
    }
    next();
  }

});
app.use('/', indexRouter);
app.use('/authorize', authorizeRouter);
app.use('/books', productRouter);
app.use('/courses', courseRouter);
app.use(function (err, req, res, next) {
  console.log(err)
  res.json({ status: 'error' });
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});
app.listen(3000);
// module.exports = app;
