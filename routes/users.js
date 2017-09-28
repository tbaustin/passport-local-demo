var passport = require('passport');
var express = require('express');
var router = express.Router();
var controllers = require('../controllers');

/* User Register */
router.post('/register', (req, res, next) => {
  controllers.user
    .post(req.body, false)
    .then(result => {
      req.login(result, err => {
        if (err) {
          res.json({
            cofirmation: 'fail',
            message: err
          });
          return;
        }

        res.json({
          confirmation: 'success',
          user: result
        });
      });
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err
      });
    });
});

/* User Login */
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({
    confirmation: 'success',
    user: req.user
  });
});

/* User Logout */
router.get('/logout', (req, res) => {
  req.logout();
  res.json({
    confirmation: 'success',
    user: null,
    message: 'User has been logged out'
  });
});

router.get('/currentuser', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      confirmation: 'success',
      user: req.user
    });
    return;
  } else {
    res.json({
      confirmation: 'success',
      user: null
    });
  }
});

module.exports = router;
