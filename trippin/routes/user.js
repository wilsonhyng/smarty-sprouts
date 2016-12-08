var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* POST user. */
router.post('/', function(req, res, next) {
  var Users = mongoose.model('Users');
  Users.find({ name: req.body.name })
  .then(function (users) {
    if (users.length < 1) {
      var user = new Users({ name: req.body.name });
      user.save();
      Users.findOne({ name: req.body.name })
      .then(function (user) {
        req.session._id = user._id;
        res.end('User Saved');
      });
    } else {
      req.session._id = users[0]._id;
      res.end('Logged In');
    }
  });
});

module.exports = router;
