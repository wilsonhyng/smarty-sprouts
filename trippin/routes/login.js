var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* POST login info. */
router.post('/', function(req, res, next) {
  var Users = mongoose.model('Users');
  Users.find({ email: req.body.email })
  .then(function (users) {
    if (users.length < 1) {
      var user = new Users({ email: req.body.email, token: req.body.token });
      user.save();
      Users.findOne({ email: req.body.email })
      .then(function (user) {
        req.session._id = user._id;
        // res.redirect('/');
        res.send({ url: '/' });
      });
    } else {
      req.session._id = users[0]._id;
      res.send({ url: '/' });
      // res.redirect('/');
    }
  });
});

module.exports = router;
