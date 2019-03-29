const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/login', (req,res) =>
    res.render('login'));

router.get('/register', (req,res) => res.render('register'));

router.post('/register', (req,res) => {
    const { name, email, password, password2 } = req.body;

    //Validations of fields
    var errors = [];
    if (!name || !email || !password || !password2){
        errors.push({msg: "Please fill in all the fields"});
    }

    //passwords must match
    if (password !== password2){
        errors.push({msg: "Passwords do not match"});
    }

    //password must be 4 characters long
    if (password.length < 4){
        errors.push({msg: "Password must be atleast 4 characters long"});
    }

    //action
    if (errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //Validation passed, create user
        User.findOne({email: email})
        .then(user => {
            if(user){
                //user already exists
                errors.push({msg: 'Email already registered.'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                //Hash password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err)
                            throw err;
                        //change to hashed password
                        newUser.password = hash 

                        //Save user
                        newUser.save()
                        .then(user =>  {
                            req.flash('success_msg', 'You have successfully registered, please login to proceed');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))

            }
        });
    }
});

router.post('/login', (req,res, next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg', 'You have successfullyy logged out');
    res.redirect('/users/login');
});
module.exports = router;