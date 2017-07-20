var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

//GET view

router.get('/', function (req, resp) {
    resp.render('contact', {title: 'Contact'})
});

router.post('/send', function (req, resp) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'wwwxdeveloper@gmail.com',
            pass: 'sheva000'

        }

    });

    var mailoption = {
        from: 'nodejswebsite',
        to: 'ultra2mh@gmail.com',
        subject: 'website submition',
        text: 'you have new submiton from: ' + req.body.user + 'email is' + req.body.email + 'message is' + req.body.message + '',
        html: '<p>have new submiton form</p><ul><li>' + req.body.user + '</li><li>email:' + req.body.email + '</li><li>message:' + req.body.message + '</li></ul>'
    };

    transporter.sendMail(mailoption, function (error, okinfo) {
        if (error) {
            console.log(error);
            resp.redirect('/')
        }
        else {
            console.log('message sent' + okinfo.response);
            resp.redirect('/')
        }
    })


});


module.exports = router;