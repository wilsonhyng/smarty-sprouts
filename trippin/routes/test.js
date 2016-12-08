var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* POST test */
router.post('/', function(req, res, next) {
  var Users = mongoose.model('Users');
  var user = new Users({ name: 'test' });
  user.save();
  console.log('SAVED USER');
  res.end('saved user');
});

module.exports = router;