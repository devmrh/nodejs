var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var db = require('monk')('localhost/nodeauth');

router.get('/show/:category',function (req, res, next) {
    var dbs = req.db;
    var posts = dbs.get('posts');

    posts.find({category: req.params.category},{},function (err, posts) {
        res.render('dashboard',{
            "title" : req.params.category,
            "posts" : posts
        })
    })

});


router.get('/add',function (req , resp , next) {
        resp.render('addcategory',{title: 'categories'})
});


router.post('/add',function (req, res, next) {

    //get form value
    var title = req.body.title;

    //we dont have imgae

    //form validation
    req.checkBody("title",'title is required').notEmpty();
    var errors = req.validationErrors();

    if (errors){
        res.render('addcategory',{
            "title" : title
        })
    }else {
        var cat = db.get("categories");

        cat.insert({
            "title":title
        },function (err, cat) {
                if (err){
                    res.send("there was an error to adding category")
                }else {
                    req.flash("success","category addedd successfully");
                    res.location('/dashboard');
                    res.redirect('/dashboard');
                }
        })

    }

});


module.exports = router;