
// Line #12 to Line #16 - Importing modules
// Line #3 to Line #6 - Importing modules
// Line #3 to Line #6 - Importing modules
// Line #3 to Line #6 - Importing modules
// Line #3 to Line #6 - Importing modules
// Line #3 to Line #6 - Importing modules
// Line #3 to Line #6 - Importing modules
// Line #3 to Line #6 - Importing modules

// Required modules
var express = require("express");
var app     = express();
var mongoose = require('mongoose');
var path = require('path')
var bodyParser= require('body-parser');
global.uname;
// Connect to MongoDB
var db = 'profiles';
mongoose.connect('mongodb://localhost/'+db);

// Create user-login db model
var User = mongoose.model('User', {
	name: String,
  email: String,
  password: String,
  friends : [String],
  to: [String],
  from: [String]

  });

//For Form data
app.use(bodyParser.urlencoded({extended: true}));

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/views'));
//Store all JS and CSS in Scripts folder.
app.use(express.static(__dirname + '/Script'));

//It will find and locate index.html from View or Scripts
app.get('/',function(req,res){
  res.sendFile('index.html');
});

app.post('/login',function(req,res){
 var query= {
   email:req.body.email,
   password:req.body.pass
 };
 User.findOne(query, function (err, user) {

   if (err || !user) {
     res.redirect('index.html');
  // res.json("Invalid Username or Password");
   } else {
     console.log(user.name+' has logged in');
     uname=user.name;
     res.redirect('/dashboard');
   }

 });

});

app.get('/signup',function(req,res){
  res.sendFile((path.join(__dirname+'/views/signup.html')));
})  ;

app.post('/signup',function(req,res){
   var userdata = {
     name:req.body.name,
     email:req.body.email,
     password:req.body.pass
   };
   var newUser = new User(userdata).save(userdata,function (err){

      console.log('New user '+req.body.name+' has been created!');
      res.redirect('index.html');

    });
});
app.get('/dashboard',function(req,res){
  res.send("hey"+uname);
})  ;

app.listen(3000);

console.log("Running at Port 3000");
