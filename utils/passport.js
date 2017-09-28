const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;
var Promise = require('bluebird');

const controllers = require('../controllers');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  controllers.user.getById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new LocalStrat((username, password, done) => {
    controllers.user
      .getUserByUsername(username)
      .then(user => {
        user = user;
        return controllers.user.comparePassword(password, user);
      })
      .then(authUser => {
        return done(null, authUser);
      })
      .catch(err => {
        return done(err, false);
      });
  })
);
