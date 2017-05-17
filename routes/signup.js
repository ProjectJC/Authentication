var express = require('express');
var router = express.Router();

var passport = require("passport");
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('signup',{ message: "message" });
});

module.exports = router;
