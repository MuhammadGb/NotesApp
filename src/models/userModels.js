const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
 email: {
  type: String,
  trim: true,
  required: true,
  unique: true
 },
  password: {
    type: String,
    required: true,
  },
  token: { type: String },
});

UserSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
})
module.exports = mongoose.model('User', UserSchema);
