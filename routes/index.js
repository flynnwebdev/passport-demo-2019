var express = require('express');
var router = express.Router();
const passport = require('passport')
const secure = require('../middleware/secure')

/* GET home page. */
router.get('/', secure, function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
