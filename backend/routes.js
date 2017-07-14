const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
//
var models = require('../models.js');
var User = models.User;
var Photo = models.Photo;


// YOUR API ROUTES HERE
router.get('/user', function(req, res) {
  console.log("finding/creating user");
  User.findOne({username: "rcsmooth"}, function(err, user){
    if(err) {console.log(err)}
    else{
      res.send(user)
    }
  }) //search for username
  // res.send({text: "this is get user"})
})


router.post('/user', function(req, res) {
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
    friendList: [],
    sentPhotos: [],
    receivedPhotos: []
  })
  newUser.save(function(err){
    if(err){console.log(err)}
  })
  res.send({text: "new user saved"})
})


router.post('/photo', function(req, res){
  // var newPhoto = new Photo({
  //   from: req.body.username,
  //   // to: ,
  //   timestamp: Date,
  //   labels: Object,
  //   imgFile: String
  // })
  res.send({text: "this is post photo"})
})

// SAMPLE ROUTE
router.use('/users', (req, res) => {
    res.json({ success: true });
});

module.exports = router;
