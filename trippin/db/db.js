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

mongoose.model('Users', Users);
mongoose.model('Pins', Pins);

mongoose.connect('mongodb://localhost:27017/trippin');

