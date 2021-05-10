require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");

const app = express();

const port = process.env.PORT;

app.use(express.json());

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    country: {
        type: String

    }
});

const User = mongoose.model("User", userSchema);

//Request to create a user record
app.post("/user", (req, res) => {

    // Getting the inputs from the body and storing  it the variable user
    const user = new User(req.body);

// Storing the content of the variable in the database 
    user.save(err => {
        if(!err) {
            res.status(200).send({"message": "Record created successfully", "data":user});
        }else{
             res.status(500).send({"message": err});
           
        }
    })
})
// Request to read all users record
app.get("/users", (req, res) => {

    User.find({}, (err, foundUsers)=>{
        if(err){
            //Handles any server error
            res.status(500).send({"message": err});
        }
        // checks if the record is empty
        if(foundUsers.length === 0){
            return res.status(200).send({"message": "Record is empty"});
        }
        // returns available  users record
        res.status(200).send({"message": "Records successfuly loaded","data":foundUsers});
    });
});

// Request to read the record of a user
app.get("/user/:_id", (req,res) => {
    User.findById(req.params._id, (err, foundUser) => {
        // Handles wrong id
        if(err){
            return res.status(400).send({"message": "Invalid Id!"});
        }
        // Handling the case of user id not in database
        if(!foundUser){
            return res.status(400).send({"message": "Record not found, please check the Id and try again"})
        }
        // Handles successfull request
        res.status(200).send({"message": "Record loaded successfully", "data": foundUser});
    });
});

//Request to update the record of a user
app.put("/update/:_id", (req, res) => {

    //checking for invalid parameter entry(keys)
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "country"];
    const isAllowed = updates.every((update) => allowedUpdates.includes(update));

    if(!isAllowed){
        return  res.status(400).send({"message": "Invalid Update!"});
      }

      // Updating of inputed parameter(s)
       User.findByIdAndUpdate(req.params._id, req.body, {new: true}, (err, updatedUser) => {
           //Handles wrong id case
          if(err){
               return res.status(400).send({"message": "Invalid Id!"});
          }
          // Handles case of Id not in database
          if (!updatedUser) {
              return res.status(400).send({"message": " Record not found"});
          }
          //  Handles successfull request 
         res.status(200).send({"message": "Record successfully Updated"});
              
          });
      
      
});

// deleting of a user record
app.delete("/delete/:_id", (req, res) => {
    User.findByIdAndDelete(req.params._id, (err, deletedUser) => {
        //Handles wrong id case
        if(err){
           return res.status(400).send({"message": "Invalid Id!"});
        }

        // Handles case of Id not in database 
        if(!deletedUser){
            return res.status(400).send({"message": "Unable to delete record, kindly check the Id and try again!"})
        }
        //Handles successfull request
        res.status(200).send({"message": "Record successfully deleted", "data": deletedUser});
    })
});


app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});