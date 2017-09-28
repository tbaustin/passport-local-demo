const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, default: '', unique: true, dropDups: true },
  password: { type: String, default: '' },
  email: { type: String, default: '', unique: true, dropDups: true },
  timestamp: { type: Date, default: Date.now }
});

UserSchema.methods.summary = function() {
  const summary = {
    username: this.username,
    email: this.email,
    timestamp: this.timestamp,
    id: this._id.toString()
  };

  return summary;
};

module.exports = mongoose.model('UserSchema', UserSchema);
