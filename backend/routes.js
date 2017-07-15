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

let nowUser = {};

var isActuallyFood = function (keywords, labels) {
    return labels.some(function (v) {
        return keywords.indexOf(v) >= 0;
    });
};



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

router.get('/user/inbox', function(req, res) {
  User.findOne({username: req.body.username}, function(err, user){
    if(err) {console.log(err)}
    else{
      res.send({success: true, userInbox: user.receivedPhotos})
    }
  }) //search for username
})


router.post('/login', function(req, res) {
  User.findOne({username: req.body.username}, function(err, user){
    if(err) {console.log(err)}
    else{
      console.log("User in backend", user);
      nowUser = user;
      console.log("this is nowUser", nowUser);
      res.send({success: true, user: user});
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

router.post('/send', function(req, res){
  console.log("entering /send route, this is req: ", req);
  User.findOne({username: req.body.username}, function(err){
    if(err){console.log(err)}
    else{
      user.receivedPhotos.push(req.body.photo);
      console.log("this photo was just pushed to receivedPhoto array: ", photo);
    }
  })
})



router.post('/vision', function(req, res) {
  console.log("Hit /vision route");

  // Your Google Cloud Platform project ID
  const projectId = 'snackchat-d4ab1';

  // Instantiates a client
  const visionClient = Vision({
    projectId: projectId,
    credentials: {
      "type": "service_account",
      "project_id": "horizons-hackathon-snackchat",
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": process.env.GCLOUD_PKEY,
      "client_email": "723578535757-compute@developer.gserviceaccount.com",
      "client_id": process.env.CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/723578535757-compute%40developer.gserviceaccount.com"
    }
  });

  console.log("This is Vision Client: ", visionClient);

  var link = req.body.link;
  console.log(req.body.username);
  console.log("This is requested link: ", link);
  // console.log("this is username: ", username);
  // const fileName = '../resources/mouse.jpg';

  // Performs label detection on the image file
  visionClient.detectLabels(link)
  .then((results) => {
    console.log("Inside visionClient results");
    const labels = results[0];
    const validFoodArr = ["Food", "Drink", "Snack", 'Vegetable', "Produce", "Pizza", "Drink", "Cuisine", "Grapes"]
    const isFood = isActuallyFood(validFoodArr, results[0])
    console.log("Results: ", results[1]);


    console.log('Labels:', labels);
    //use criteria for photo here ODO: //asdfasdfasdf

    var newPhoto = new Photo({
      from: nowUser.username,
      to: '',
      timestamp: Date.now(),
      labels: labels,
      imgFile: link,
      isFood: isFood
    });

    // console.log("this is username2: ", username);

    // User.findOne({username: username}, function(err, user){
    //   if(err){console.log(err)}
    //   else{
    //     // console.log("this is user.findone result:", user);
    //     console.log("this is nowUser GV: ", nowUser);
    //
    //
    //   }
    // })
    console.log("this is nowUser: ", nowUser);
    nowUser.sentPhotos.push(newPhoto);
    nowUser.save(function(err){
      if(err){console.log(err)}
      else{
        console.log("api labels saved");
        // res.status(200).send(JSON.stringify({"success": true, "link": link, "user": labels}));
        res.send({"success": true, "link": link, "label": labels});
      }
    })
    // currentUser.save(function(err){
    //   if(err){console.log("saving error: ", err)}
    //   else {
    //     console.log("api labels saved");
    //     res.status(200).send(JSON.stringify({"success": true, "link": link, "results": results}));
    //
    //   }
    // })
    // labels.forEach((label) => console.log(label));
  })
  .catch((err) => {
    res.send({visionClientError: err});
    console.error('ERROR:', err);
  });
})

module.exports = router;
