const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const bcrypt = require('bcryptjs');

//authentication using password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    function(req,email,password,done){
        // find a user and establish identity
        
        User.findOne({email: email},function(err,user){
            if(err){
                req.flash('error', 'Error in finding the user');
                return done(err);
            }
            
            console.log(user.password);
            if(!user || !bcrypt.compareSync(password, user.password)){
                req.flash('error', 'Invalid username/password');
                return done(null, false);
            }
            return done(null, user);
        });
    }
));


// serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){
        if(err){
            console.log('Error in finding user --> passport');
                return done(err);
        }
        return done(null,user);
        
    });
});

//check if the user is authenticated
passport.checkAuthentication = function(req,res,next){
    // if the user is signed in , then pass on the requrest to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in 
    return  res.redirect('/users/signin');
}

passport.setAuthenticatedUser = function(req,res,next){
    if( req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports.passport;