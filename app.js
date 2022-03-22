//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));



//Mongoose connection to MongoDB for our User sign up database.
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});


//Mongoose Schema to adding items to DB. //Encryption add on
const userSchema = new mongoose.Schema({
    email: String, 
    password: String
});


//Mongoose encryption plug-in for user logins & register.

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]}); 

//add our encrypt plug in before creating the new model.

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});

//Get the information the client is submitting in the Register page. 
 
app.post("/register", function (req, res) {
    
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
        
    });

});

app.post("/login", function (req, res) {
       const username = req.body.username;
       const password = req.body.password;

       User.findOne({email: username}, 
        function (err, foundUser) {
            if(err){
                console.log(err);
            } else {
                if (foundUser) {
                 if (foundUser.password === password) {
                     res.render("secrets");

                 }   
                }
              } 
       });
});



app.listen(3000, function(){
    console.log("Successfully connected to port 3000.");
});