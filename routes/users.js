var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalSterategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({dest: "uploads"});
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', function (req, resp) {
    resp.render('register', {
        title: 'Register'
    })
});

router.get('/login', function (req, resp) {
    resp.render('login', {
        title: 'login'
    })
})

router.post('/register', function (req, resp, next) {

    //GET form values
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password1 = req.body.password1;
    var password2 = req.body.password2;


    //check form validation
    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email not valid').isEmail();
    req.checkBody('email', 'username required').notEmpty();
    req.checkBody('password1', 'password is required').notEmpty();
    req.checkBody('password2', 'password not match').equals(req.body.password1);


    //check for error
    var errors = req.validationErrors();

    if (errors) {
        resp.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password1: password1,
            password2: password2
        })
    }
    //check for profile image
    if (req.file) {
        var profileimage = req.file.filename;
    } else {
        profileimage = 'noimage.png'
    }

    var newuser = new User({
        name: name,
        email: email,
        username: username,
        password: password1,
        profileimage: profileimage

    });

    // createuser
    User.createUser(newuser, function (err, user) {
        if (err) throw err;
        console.log(user);
    });

    //successmessage

    req.flash('Success', 'You are registed and you can login now');

    resp.location('login');
    resp.redirect('login');

});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalSterategy(function (username, password, done) {
    User.getUserByusername(username, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log("Unknown user");
            return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function (error, ismatch) {
            if (error) throw error;
            if (ismatch) {
                return done(null, user)
            } else {
                console.log("invaild password");
                return done(null, false, {message: "invailed password"})
            }

        })

    })
}));

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: "invailed username or password"
}), function (req, res, next) {
    console.log("authentecation successfull.");
    req.flash('success', 'you are succesffly log\'end');
    res.redirect('/dashboard');
});

router.get('/logout', function (req, resp) {
    req.logout();
    req.flash('success', 'you have loged out');
    resp.redirect('/users/login')
});

module.exports = router;
