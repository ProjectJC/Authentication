var LocalStrategy   = require('passport-local').Strategy;
var User            = require('./models/user');

module.exports = function(passport) {

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


            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
                User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        const newUser            = new User();
                        newUser.generateHash(password).then((hash) => {
                            newUser.email = email;
                            newUser.hash = hash;
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });

                        });


                    }

                });

            });

        }));


    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            console.log(req.body);
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                if(user.checkHash(password,user.hash)){
                    return done(null, user);
                }else{
                    return done(null, false);
                }
                // all is well, return successful user

            });

        }));

};