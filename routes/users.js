var express = require('express');
const {
  UserModel
} = require('../models/user')
const passport = require('passport')
var router = express.Router();

router.post('/register', (req, res) => {
  const newUser = new UserModel({
    email: req.body.email,
    role: 'guest'
  })
  UserModel.register(newUser, req.body.password, err => {
    if (err) {
      res.status(500).send(err.message)
    }
    // Tell Passport to log in the new user
    passport.authenticate('local')(req, res, () => {
      // req.user now exists
      req.session.role = req.user.role || 'guest'
      res.json(req.user)
    })
  })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  // At this point, req.user exists and auth was successful
  req.session.role = req.user.role || 'guest'
  res.json(req.user)
})

router.get('/logout', (req, res) => {
  req.logout()
  res.sendStatus(200)
})

module.exports = router;