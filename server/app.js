var express = require('express');
var app = express();
var _dirname = '../client';
var bodyParser = require('body-parser');
var dataStorage = [];


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../client'));

app.route('/classes/messages')
  .get(function(req, res) {
    res.status(200).json({
      results: dataStorage
    }).end();
  }).post(function(req, res) {
    var body = req.body;
    dataStorage.push(body);
    res.status(201).end();
  });













app.listen(3000, function() {

});