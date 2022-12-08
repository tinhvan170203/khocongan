var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const session = require('express-session');
var flash = require('connect-flash');


var mainRouter = require('./routes/main');
var clientRouter = require('./routes/client');


var app = express();
app.listen(3000, ()=> {
    console.log("123123")
})

// const url = 'mongodb://localhost:27017/khoPH10';
const url = 'mongodb+srv://Vuvantinh1:Vuvantinh1@cluster0.pmxuoc2.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) throw err;
    console.log('Kết nối CSDL thành công');
});



app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'vuvantinh',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', clientRouter);
app.use('/quan-tri', mainRouter);

app.all('*', (req, res) => {
    res.send('Không tìm thấy trang web này')
})

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

// module.exports = app;