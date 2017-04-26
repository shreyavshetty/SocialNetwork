
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
var fs = require('fs');
var router = express.Router();
var multer = require('multer');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
global.uname;

//To get the access for the functions defined in index.js class
//var routes = require('./views/imagefile');

// ALL IMAGES UPLOADING DECLARATION
/*router.addImage = function(image, callback) {
 Image.create(image, callback);
}    */

// To get more info about 'multer'.. you can go through https://www.npmjs.com/package/multer..
var storage = multer.diskStorage({
 destination: function(req, file, cb) {
 cb(null, 'uploads/')
 },
 filename: function(req, file, cb) {
 cb(null, file.originalname);
 }
});

var upload = multer({
 storage: storage
});






// END OF ALL IMAGE UPLOADING DECLARATION

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
  from: [String],
	path: [String]
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
     console.log(user.name+' has logged in ...');
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
app.get('/dashboard', function(req, res) {
  /*User.find({name:{$nin:[uname]}}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {User: result})
  });
}*/
var pttCursor = User.find({name:{$nin:[uname]}})
    .exec(function(err, membersArray){
        res.render("index.ejs", {
            member : membersArray, // get user out of session and pass to template
	          user : uname


        });


    });
    console.log(uname);
});
/*var pttCursor = User.find({name:{$nin:[uname]}})
    .exec(function(err, membersArray){
        res.render("index.ejs", {
            member : membersArray // get user out of session and pass to template

        });
    });
app.get('/dashboard',function(req,res){
  User.find({name:{$nin:[uname]}},function(err,docs){
    res.send(docs);
  }).select('name');
  //res.send("hey"+uname);
});*/
app.get('/friendrequests',function(req,res){
  var pttCursor = User.find({name:uname})
      .exec(function(err, membersArray){
          res.render("friendrequests.ejs", {
              member : membersArray, // get user out of session and pass to template
              user : uname

          });

      });
      //console.log(uname);
  //res.send("hey");
});

app.get('/acceptrequest/:names',function(req,res){
	console.log(req.params.names+'\'s request accepted');
	var temp=req.params.names;
	User.update({name: uname}, { $push: { friends : temp } },function(err,place){
		console.log('Friends of '+uname+' Updated');
	});
	User.update({name:uname},{$pull:{from:{ $in:[temp]}}},{multi:true},function (err, place) {
		res.redirect('/dashboard');
});
});

app.get('/viewme/:names',function(req,res){
	//			file = User. ;
	     var temp=req.params.names;
			 var i=0;
			 var img=[],imagedata=[];

	/*	 var ptr=Users.findOne({name:temp}).path;
			 while(i<ptr.length)  */
			 var pttCursor = User.findOne({name:temp})
			     .exec(function(err, membersArray){
						 var temp=req.params.names;
						 var i=0;
						 var img=[],imagedata=[];
						 var len=membersArray.path.length;
						 console.log(len);
						 while(i<len)
						 {
							  console.log(membersArray.path);
						  	img[i] = fs.readFileSync(__dirname+'/'+membersArray.path[i]);
								imagedata[i]=	new Buffer(img[i]).toString('base64');
								i++;
						 }
			        res.render("pic.ejs",{
								member:membersArray,
								user : temp,
								img : img,
								imagedata : imagedata,
								len :len
							});



			     });

    /*     //var dirname = (path.join(__dirname+'file-upload');
         var img = fs.readFileSync(__dirname + '/uploads/' + file);
   //      res.writeHead(200, {'Content-Type': 'text/html'});
         imagedata = new Buffer(img).toString('base64');    //encode to base64
         res.render(path.join(__dirname + '/views/pic.ejs'));
     //    res.write('<img src="data:image/gif;base64,'+imagedata+'" width="269" height="269">');//send image
     //    res.end();

*/
});
app.get('/addme/:names',function(req,res){
	console.log(req.params.names);
	var temp=req.params.names;
	User.update({name: temp}, { $push: { from : uname } }, function (err, place) {
	  res.send("Request Sent :)");
});
});
/*app.post('/addme/:names',function(req,res){
  var pttCursor = User.findOne({name:{$in:[req.params.names]}})
      .exec(function(err, membersArray){
        User.update(
   { name :req.params.names},
   { $push: { from : req.params.names } }
);
          //res.render("friendrequests.ejs", {
            //  member : membersArray, // get user out of session and pass to template
             //user : uname

          });

      });
 */
  //res.send("hey add me mate");

// ALL IMAGE GET POST ACTIONS HERE
app.get('/upload', function(req, res) {
	res.render('upload.ejs');
 });

app.post('/upload', upload.any(),function(req, res,next){

 res.send(req.files);

/*req.files has the information regarding the file you are uploading...
from the total information, i am just using the path and the imageName to store in the mongo collection(table)
*/
 var path = req.files[0].destination+req.files[0].originalname;
 //var imageName = req.files[0].originalname;

 //var imagepath;
 var temp=uname;
 User.update({name: uname}, { $push: { path : path } }, function (err, place) {
 	//res.render('pic.ejs');
});
 //imagepath['originalname'] = imageName;

 //imagepath contains two objects, path and the imageName

 //we are passing two objects in the addImage method.. which is defined above..

 //res.render(path.join(__dirname + '/views/pic.ejs'));
});

app.get('/logout',function(req,res){
	res.redirect('index.html');
});

// END OF ALL GET POST ACTIONS

app.listen(3000);

console.log("Running at Port 3000");
