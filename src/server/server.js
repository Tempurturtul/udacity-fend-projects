var express = require('express');
var path = require('path');
var clr = require('connect-livereload');
var app = module.exports.app = exports.app = express();

app.use(clr());
app.use(express.static(path.join(__dirname, "../client")));
app.listen(3000);

// Log output required for gulp task.
console.log('Server listening on port 3000.');
