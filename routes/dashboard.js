var express = require('express');
var Router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeauth');

Router.get('/', function (req, resp) {

    //var db = require('monk')('localhost/nodeauth');

    var dbs = req.db;
    var posts = dbs.get('posts');
    posts.find({}, {}, function (err, posts) {
        //if (err) throw err;
        resp.render('dashboard',
            {
                "posts": posts
            });
    })
});

module.exports = Router;