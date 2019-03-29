const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user model
const User = require('../models/User');


module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({email: email}, (err, user) => {
            if(err)
                return done(err);
            if(!user)
                return done(null, false, {msg: 'No user found with the email.'});
            //User exists check for valid password
            bcrypt.compare(password, user.password, (err, ismatch) => {
                if(err)
                    return done(err);
                if(ismatch){
                    return done(null, user);
                }else{
                    return done(null, false, {msg: 'Passwords do not match.'});
                }
            });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
       
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}