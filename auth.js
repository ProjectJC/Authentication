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
            passwordField : 'password'
        },
        function(req,firstName,lastName, email, password, done) {


            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
                User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false);
                    } else {

                        const newUser            = new User();
                        // newUser.generateHash(password).then((hash) => {
                        //     newUser.email = email;
                        //     newUser.hash = hash;
                        //     newUser.save(function(err) {
                        //         if (err)
                        //             throw err;
                        //         return done(null, newUser);
                        //     });
                        //
                        // });

                        newUser.email = email;
                        newUser.hash = password;
                        newUser.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, newUser);
                                });
                    }

                });

            });

        }));

};