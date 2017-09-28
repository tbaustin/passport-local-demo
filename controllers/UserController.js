var Promise = require('bluebird');
var bcrypt = require('bcryptjs');

var User = require('../models/User');

module.exports = {
  get: (params, isRaw) => {
    return new Promise((resolve, reject) => {
      User.find(params, (err, users) => {
        if (err) {
          reject(err);
          return;
        }
        if (isRaw) {
          resolve(users);
        } else {
          const list = [];
          users.forEach(user => {
            list.push(user.summary());
          });

          resolve(list);
        }
      });
    });
  },

  getUserByUsername: username => {
    return new Promise((resolve, reject) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          reject(err);
          return;
        }
        if (!user) {
          reject({ message: 'Unknown User' });
          return;
        }

        resolve(user);
      });
    });
  },

  comparePassword: (password, user) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          reject(err);
          return;
        }
        if (isMatch === true) {
          resolve(user.summary());
        } else {
          reject({ message: 'Wrong Password' });
        }
      });
    });
  },

  getById: (id, isRaw) => {
    return new Promise((resolve, reject) => {
      User.findById(id, (err, user) => {
        if (err) {
          reject(err);
          return;
        }

        if (user == null) {
          reject(err);
        }

        if (isRaw) {
          resolve(user);
        } else {
          resolve(user.summary());
        }
      });
    });
  },

  post: (params, isRaw) => {
    return new Promise((resolve, reject) => {
      //hash password
      if (params['password']) {
        params['password'] = bcrypt.hashSync(params.password, 10);
      }

      User.create(params, (err, user) => {
        if (err) {
          if (err.toJSON().code === 11000) {
            reject(
              `${err.toJSON().op.username ||
                err.toJSON().op.email} has already been taken`
            );
            return;
          }
          reject(err);
          return;
        }
        if (isRaw) {
          resolve(user);
        } else {
          console.log(user);
          resolve(user.summary());
        }
      });
    });
  }
};
