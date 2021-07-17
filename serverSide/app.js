var express = require('express');
var cookieParser = require('cookie-parser');
const cors = require('cors');

var indexRouter = require('./routes/index');
const productRouter = require('./routes/Books.js');
const authorizeRouter = require('./routes/auth.js');
const userCartRouter = require('./routes/cart.js');
const userHistoryRouter = require('./routes/history.js');
const jwtManager = require('./jwt/jwtManager');


var app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', (req, res, next) => {
  if (req.url === '/authorize') {
    // console.log(req.url);
    next();
    return;
  }
  const header = req.headers.authorization;
  if (!header) {
    return res.json({status: 'auth_error'});
  } else {
    const jwt = new jwtManager();
    const data = jwt.verify(header.split(' ')[1]);
    // console.log(data);
    if (!data) {
      return res.json({ status: 'auth_err' });
    }
    next();
  }

});
app.use('/', indexRouter);
app.use('/authorize', authorizeRouter);
app.use('/books', productRouter);
app.use('/cart', userCartRouter);
app.use('/history', userHistoryRouter);


app.use(function (err, req, res, next) {
  console.log(err)
  res.json({ status: 'error' });
});
app.listen(3000);
