var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

var Users = new Schema({
  email: String,
  token: String
});

var Pins = new Schema({
  userId: { type: ObjectId, ref: 'Users' },
  title: String,
  description: String,
  lat: Number,
  lon: Number,
  image: String
});

var Photos = new Schema({
  userId: { type: ObjectId, ref: 'Users' },
  image: { data: Buffer, contentType: String }
});

mongoose.model('Users', Users);
mongoose.model('Pins', Pins);
mongoose.model('Photos', Photos);

var host = (process.env.MONGOLAB_URL || 'mongodb://localhost:27017/trippin');

mongoose.connect(host);

