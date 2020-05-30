var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var playerRouter = require('./routes/player');
var tatetiRouter = require('./routes/tateti');
var gameRouter = require('./routes/game');
var moveRouter = require('./routes/match');
var roomRouter = require('./routes/room');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/player', playerRouter);
app.use('/tateti', tatetiRouter);
app.use('/game', gameRouter);
app.use('/game/move', moveRouter);
app.use('/room', roomRouter);

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