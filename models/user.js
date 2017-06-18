var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

var userSchema = mongoose.Schema({
    username:   String,
    email:      String,
    hash:       String,
    firstName:  String,
    lastName:   String,
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

userSchema.methods.generateHash = function(password){
    return bcrypt.genSalt(10).then((salt) => {
            return bcrypt.hash(password,salt);
        })
};

userSchema.methods.checkHash = function(password,hash){
    return bcrypt.compareSync(password,hash)
};

module.exports = mongoose.model('User',userSchema);