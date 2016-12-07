var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

var Users = new Schema({
  name: String,
});

var Pins = new Schema({
  userId: { type: ObjectId, ref: 'Users' },
  lat: Number,
  lon: Number
});

Mongoose.model('Users', Users);
Mongoose.model('Pins', Pins);

mongoose.connect('mongod://localhost/trippin');