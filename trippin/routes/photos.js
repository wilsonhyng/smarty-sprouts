var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET photos */
router.get('/', function(req, res, next) {
  var Photos = mongoose.model('Photos');
  Photos.find({ userId: req.session._id })
  .then(function(photos) {
    res.send(JSON.stringify(photos));
  });
});

/* POST photo */
router.post('/', function(req, res, next) {
  var Photos = mongoose.model('Photos');
  var photo = new Photos({ userId: req.session._id, image: req.body.image });
  photo.image.contentType = req.body.type; //send in type of image (ie. png, jpg, etc.)
  photo.save();
  res.end('Saved Photo');
});

module.exports = router;