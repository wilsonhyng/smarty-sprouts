var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* POST logout. */
router.post('/', function(req, res, next) {
  delete req.session._id;
  res.send('Logged Out');
});

module.exports = router;
