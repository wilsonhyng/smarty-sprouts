var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET pins. */
router.get('/', function(req, res, next) {
  if (!req.session._id) {
    res.end('Not Signed In');
    return;
  }
  var Pins = mongoose.model('Pins');
  Pins.find({ userId: req.session._id })
  .then(function(pins) {
    res.end(pins);
  });
});

/* POST pins. */
router.post('/', function(req, res, next) {
  if (!req.session._id) {
    res.end('Not Signed In');
    return;
  }
  var Pins = mongoose.model('Pins');
  var pin = new Pins({ userId: req.session._id, lat: req.body.lat, lon: req.body.lon });
  pin.save();
  res.end('Pin Saved');
});

module.exports = router;
