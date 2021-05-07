const express = require('express');
const User = require('../model/user');
const router = new express.Router();

router
// Creates new user record
.post('/user', (req, res) => {
    const user = new User(req.body);

    user.save(err => {
        if(!err) {
            res.status(200).send({"message": "Record created successfully", user});
        }else{
            res.status(500).send({"message": err});
        }
    })
})
// Reading of records
.get('/user', (req, res) => {
    const users = User.find({}, (err, foundUsers)=>{
        if(err){
            //Handles any server error
            res.status(500).send({"message": err});
        }
        // checks if the record is empty
        if(foundUsers.length === 0){
            res.status(200).send({"message": "Record is empty"});
        }
        // returns available  users records
        res.status(200).send({"message": "Records successfuly loaded",foundUsers});
    });
})

.put('/user/:_id', (req, res) => {
    //checking for invalid parameter entry
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "country"];
    const isAllowed = updates.every((update) => allowedUpdates.includes(update));

    if(!isAllowed){
        return  res.status(400).send({"message": "Invalid Update!"});
      }
      // Updating of inputed parameter(s)
       User.findByIdAndUpdate(req.params._id, req.body, {new: true}, (err, updatedUser) => {
          if(err){
              res.status(400).send({"message": err});
          }
          
         res.status(200).send({"message": "Record successfully Updated", updatedUser})
              
          })
      
      
})
// deleting of user
.delete('/user/:_id', (req, res) => {
    User.findByIdAndDelete(req.params._id, (err, deletedUser) => {
        if(err){
            res.status(400).send({"message": err});
        }
        res.status(200).send({"message": "Record successfully deleted", deletedUser});
    })
})
module.exports = router;