const LocalStrategy = require('passport-local').Strategy;
const User = require('../schemas/users');
const createError = require('http-errors');

module.exports = function(passport) {
    // used to serialize and deserialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                // Checking if user email already exists in the database
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user)
                        return done(createError(409, 'This email is already taken.'));
                        // return done("That email is already taken.");

                    let newUser                 = new User();

                    newUser.profile.email       = email;
                    newUser.profile.password    = newUser.generateHash(password);
                    newUser.profile.firstName   = req.body.firstName;
                    newUser.profile.lastName    = req.body.lastName;
                    newUser.profile.phone       = req.body.phone;
                    newUser.profile.referral    = req.body.referral;

                    // newUser.profile.verification.code = generateVerificationCode();
                    // newUser.profile.verification.verified = false;

                    // save the user
                    newUser.save(function(err) {
                        // console.log(err);
                        if (err)
                            throw err;

                        req.login(newUser, function(err) {
                            if (err) { return done(err); }
                        });

                        return done(null, newUser);
                    });
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            // checking if the user with the email already exists
            process.nextTick(function() {

                User.findOne({'profile.email': email}, function (err, user) {
                    if (err)
                        return done(err);
                    if (!user)
                        return done(createError(404, 'No user found, please check your email'));
                        // return done({status: 401, message: 'No user found, please check your email'}); // req.flash is the way to set flashdata using connect-flash
                    if (!user.validPassword(password))
                        return done(createError(401, 'Incorrect password')); // create the loginMessage and save it to session as flashdata
                        // return done({status: 401, message: 'Incorrect password'}); // create the loginMessage and save it to session as flashdata

                    req.login(user, function(err) {
                        if (err) { return done(err); }
                    });

                    return done(null, user);
                });
            });

        }));

};