var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
var findOrCreate = require('mongoose-find-or-create');

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!
var Schema = mongoose.Schema

// var ID = function () {
//   // Math.random should be unique because of its seeding algorithm.
//   // Convert it to base 36 (numbers + letters), and grab the first 9 characters
//   // after the decimal.
//   return '_' + Math.random().toString(36).substr(2, 9);
// };


var userSchema = new Schema({
    username: String,
    password: String,
    friendList: Array,
    receivedPhotos: [],
    sentPhotos: []
});

var photoSchema = new Schema({
    from: String,
    to: String,
    timestamp: Date,
    labels: Object,
    imgFile: String,
    isFood: Boolean
});

userSchema.plugin(findOrCreate);


var User = mongoose.model('User', userSchema);
var Photo = mongoose.model('Photo', photoSchema);


module.exports = {
  User: User,
  Photo: Photo
};
