
var express = require('express');


module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index', {
            loggedIn: req.isAuthenticated(),
        });
    });


    app.get('/signup', function(req, res) {

        res.render('signup', { message: req.flash('signupMessage') });
    });

    app.get('/login', function(req, res) {

        res.render('login', {
            loggedIn: req.isAuthenticated()
        });
    });

    app.get('/canvas', function(req, res) {

        res.render('canvas', {
            loggedIn: req.isAuthenticated(),
            room: 1
        });
    });

    app.get('/canvas2', function(req, res) {

        res.render('canvas', {
            loggedIn: req.isAuthenticated(),
            room: 2
        });
    });

    app.get('/canvas3', function(req, res) {

        res.render('canvas', {
            loggedIn: req.isAuthenticated(),
            room: 3
        });
    });

    app.get('/canvas4', function(req, res) {

        res.render('canvas', {
            loggedIn: req.isAuthenticated(),
            room: 4
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};


function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();



    res.redirect('/');
};
