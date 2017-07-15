const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//
var models = require('../models.js');
var User = models.User;
var Photo = models.Photo;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// YOUR API ROUTES HERE
router.get('/user', function(req, res) {
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
  var newPhoto = new Photo({
    from: req.body.from,
    to: req.body.to,
    timestamp: Date.now(),
    labels: req.body.labels,
    imgFile: req.body.link
  })

  User.findOne({username: "rcsmooth"}, function(err, user){
    if(err){console.log(err)}
    else{
      user.receivedPhotos.push(newPhoto);
      user.save(function(err){
        if(err){console.log(err)}
        else{console.log("photo saved")}
        res.send({text: "picture saved into received photos"})
      })
    }
  })
})

router.post('/addfriend', function(req, res){
  User.findOne({username: "rcsmooth"})
  .then(user1, User.findOne({username: req.body.username})) //current user
  .then(user2, function(user1, user2){                  //add user
      user1.friendsList.push(user2.username);
      user1.save(function(err){
        if(err){console.log(err)}
        else{res.send({text: 'friend saved in user!'})}
    })
  })
})


module.exports = router;
