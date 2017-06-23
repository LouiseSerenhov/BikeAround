var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Biketrip = require("./models/biketrip");
var Comment     = require("./models/comment");
var seedDB      = require("./seeds");
var   flash       = require("connect-flash");
var passport = require("passport");
var LocalStrategy         = require("passport-local");
var User                  = require("./models/user");
var methodOverride = require("method-override");


app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/bikeTrip");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
seedDB();
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG 

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.sucess = req.flash("error");
   next();
});






app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/bikeTrips", function(req, res){
    console.log(req.user);
    Biketrip.find({}, function(err, allBiketrips){
       if(err){
           console.log(err);
       } else {
          res.render("biketrips/biketrips",{biketrips:allBiketrips, currentUser: req.user});
       }
    });
});
 


app.post("/biketrips", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newBiketrip = {name: name, image: image};
       Biketrip.create(newBiketrip, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/biketrips");
        }
    });
});

app.get("/biketrips/new", function(req, res){
   res.render("biketrips/new"); 
});


// SHOW
app.get("/biketrips/:id", function(req, res){
    //find the campground with provided ID
    Biketrip.findById(req.params.id).populate("comments").exec(function(err, foundBiketrip){
        if(err){
            console.log(err);
        } else {
            console.log(foundBiketrip);
            //render show template with that campground
            res.render("biketrips/show", {biketrip: foundBiketrip});
        }
    });
});


// ====================
// COMMENTS ROUTES
// ====================


app.get("/biketrips/:id/comments/new", isLoggedIn, function(req, res){
    Biketrip.findById(req.params.id, function(err,biketrip){
        if (err){
            console.log(err);
        } else {
             res.render("comments/new", {biketrip:biketrip});
        }
    });
});
    

app.post("/biketrips/:id/comments", isLoggedIn, function(req, res){
  
   Biketrip.findById(req.params.id, function(err, biketrip){
      if(err){
          console.log(err);
          res.redirect("/biketrips");
      } else {
          console.log("Du har kommit hit!");
        Comment.create(req.body.comment, function(err, comment){
          if(err){
              console.log(err);
          } else {
              // add username and id to comment
              comment.author.id = req.user._id;
              comment.author.username = req.user.username;
             
              biketrip.comments.push(comment);
              biketrip.save();
               comment.save();
               console.log(comment);
              res.redirect('/biketrips/' + biketrip._id);
          }
        });
      }
  });
});    
    
    
    
//  ===========
// AUTH ROUTES
//  ===========



//show the register form
app.get("/register", function(req, res) {
   res.render("register"); 
});

//handle register logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/biketrips"); 
           console.log(newUser);
        });
    });
});


// show login form
app.get("/login", function(req, res){
   res.render("login", {message: req.flash("error")}); 
});

// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        
        successRedirect: "/biketrips",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic logout route
app.get("/logout", function(req, res){
   req.logout();
   req.flash("error", "Du är nu utloggad");
   res.redirect("/biketrips");
});


// Middleware 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log("Inloggad verkar det som");
        return next();
    }
    console.log("Du är INTE inloggad verkar det som");
    req.flash("error", "Du har inte behörighet att göra detta, testa logga in först!");
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The BikeAround Server Has Started!");
});