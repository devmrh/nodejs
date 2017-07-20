var express = require('express');
var Router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeauth');
var multer = require('multer');
var upload = multer({dest: "uploads/"});


Router.get('/add', function (req, resp, next) {
    var categories = db.get('categories');
    categories.find({}, {}, function (err, categories) {
        resp.render('addpost', {
            "titlekk": 'AddPost',
            "categories": categories
        })
    })

});

Router.post('/add', function (req, res, next) {

    //get form values
    var title = req.body.title;
    var categoty = req.body.category;
    var body = req.body.bodym;
    var author = req.body.author;
    var date = new Date();


    //form validation

    req.checkBody('title', 'this feiled name title is required').notEmpty();
    //  req.checkBody('body', 'post body is required');

    //check errors
    var errors = req.validationErrors();
    if (errors) {
        res.render('addpost', {
            'errors': errors,
            'title': title,
            'body': body
        });
    } else {


            if (req.file) {
                var mainImageName = req.file.filename;
            }else { mainImageName = 'noimage.png' }
        var posts = db.get('posts');

        posts.insert({
            "title": title,
            "body": body,
            "category": categoty,
            "date": date,
            "author": author,
            "mainimage": mainImageName
        }, function (err, post) {
            if (err) {
                res.send("there was an issue")
            } else {
                req.flash("success", "inserting post to database was succcessed");
                res.location("/dashboard");
                res.redirect('/dashboard')
            }
        });
    }


});


module.exports = Router;