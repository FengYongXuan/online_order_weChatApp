var express = require('express');
var router = express.Router();

// home页面
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
