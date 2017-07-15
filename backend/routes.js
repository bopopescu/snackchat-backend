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
  User.findOne({username: "Ryan"}, function(err, user){
    if(err) {console.log(err)}
    else{
      res.send({succes: true, user: user})
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
  res.send({success: true})
})


router.post('/photo', function(req, res){
  var newPhoto = new Photo({
    from: req.body.from,
    to: req.body.to,
    timestamp: Date.now(),
    labels: req.body.labels,
    imgFile: req.body.link
  })

  User.findOne({username: "Ryan"}, function(err, user){
    if(err){console.log(err)}
    else{
      user.receivedPhotos.push(newPhoto);
      user.save(function(err){
        if(err){console.log(err)}
        else{console.log("photo saved")}
        res.send({text: "picture saved into Ryan's received photos"})
      })
    }
  })
})

router.post('/addfriend', function(req, res){
  // User.findOne({username: "rcsmooth"})
  // .then(user1, function(err) {
  //   User.findOne({username: req.body.username})
  //   .then(user2, function(err) {
  //
  //   })
  // })
  //
  // {
  //   )
  // }
  // .then(user1, function(user2){
  //   user1.friendsList.push(user2.username);
  //
  //   user1.save(function(err){
  //     if(err){console.log(err)}
  //     else{res.send({text: 'friend saved in user!'})}
  //   })
  // })
  res.send({text: "this feature is not implemented yet lolz"})
})


module.exports = router;
