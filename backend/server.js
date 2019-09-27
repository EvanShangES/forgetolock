const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const morgan    = require('morgan');
const session   = require('express-session');
const passport  = require('passport');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const path = require("path");

const databaseConfig = require('./config/databases.js');
mongoose.connect(
        databaseConfig.url,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


const app = express();

// set up the express application
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ useNewUrlParser: true }));
app.use(bodyParser.json());

// required for passport session set up
app.use(session({
    secret: 'forgolock',
    cookie: { maxAge: 60000 * 60},
    saveUninitialized: false,
    resave: false }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Routes / Apis ======================================================================
require('./apis/userApis')(app, passport);


const port = process.env.PORT || 3001;

// app.listen(port);
app.listen(port, () => console.log(`The port is open @ ${port}`));