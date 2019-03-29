const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

const db = require('./config/keys').MongoURI
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('Mongo db connected'))
    .catch(err => console.log(err));

//ejs layout and view-engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Express session
app.use(session({
    secret: 'top secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }))

//Passport session, put only after express session
app.use(passport.initialize());
app.use(passport.session());


//Use flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Body-Parser
app.use(express.urlencoded({extended: false}));

app.use('/users', require('./routes/users'));
app.use('/', require('./routes/index'));
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`magic happens at port ${PORT}`));