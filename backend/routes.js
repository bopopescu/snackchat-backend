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

// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');





// The name of the image file to annotate
// const fileName = '../resources/mouse.jpg';

// YOUR API ROUTES HERE
router.get('/user', function(req, res) {
  User.findOne({username: "Ryan"}, function(err, user){
    if(err) {console.log(err)}
    else{
      res.send({success: true, user: user})
    }
  }) //search for username
  // res.send({text: "this is get user"})
})

router.post('/login', function(req, res) {
  User.findOne({username: req.body.username}, function(err, user){
    if(err) {console.log(err)}
    else{
      res.send({success: true, user: user})
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



router.post('/vision', function(req, res) {
  console.log("Hit /vision route");

  // Your Google Cloud Platform project ID
  const projectId = 'snackchat-d4ab1';

  // Instantiates a client
  const visionClient = Vision({
    projectId: projectId
  });

  console.log("This is Vision Client: ", visionClient);

  var link = req.body.link;
  console.log("This is requested link: ", link);

  // const fileName = '../resources/mouse.jpg';

  // Performs label detection on the image file
  visionClient.detectLabels(link)
  .then((results) => {
    console.log("Inside visionClient results");
    const labels = results[0];
    console.log("Results: ", results[1]);
    console.log('Labels:');
    //use criteria for photo here ODO: //asdfasdfasdf

    // labels.forEach((label) => console.log(label));
    res.status(200).send(JSON.stringify({"success": true, "link": link, "results": results}));
  })
  .catch((err) => {
    res.send({visionClientError: err});
    console.error('ERROR:', err);
  });
})

module.exports = router;
