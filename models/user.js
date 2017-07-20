var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
mongoose.connect("mongodb://localhost/nodeauth");

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String, required: true, bcrypt: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    },
    versionKey: false
});


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function (condidatePassword, hash, callback) {
    bcrypt.compare(condidatePassword,hash,function (err, ismatch) {
        if (err) return callback(err);
        callback(null, ismatch);
    })
};

module.exports.getUserById = function (id ,callback) {
    User.findById(id, callback);
};

module.exports.getUserByusername = function (username ,callback) {
  var query = {username: username};
  User.findOne(query, callback);
};

module.exports.createUser = function (newUser, callback) {
    bcrypt.hash(newUser.password, 10, function (err, hashed) {
        if (err) throw err;
        //set hashed password
        newUser.password = hashed;

        //saving data
        newUser.save(callback);
    })

};