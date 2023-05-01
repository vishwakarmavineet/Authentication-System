const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Otp = require('../models/otp');
const { db} = require('mongodb');
const bcrypt = require('bcryptjs');

//render the profile page
module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err,user){
        return res.render('profile',{
            title: 'profile page',
            profile_user:user
        });
    })
    
}


//render the signup page
module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('signup',{
        title: "Codial | signup"
    });
}


//render the signin page
module.exports.signin = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('signin',{
        title: "Codial | signin"
    });
}

// render the change_password page
module.exports.changePassword = async function(req,res){
    res.render('change_password',{
        title: 'Change Password'
    });
}

// get the signup data
module.exports.create = function(req,res){
    // checking password and confirm password match or not 
    if(req.body.password != req.body.confirm_password){
        return res.redirect("back");
    }

    //converting the password to hash code
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);

    //checking user is already exist
    User.findOne({email: req.body.email}, function(err,user){
        if(err){console.log('error in finding user in signing up');return}

        if(!user){
            User.create({
                name:req.body.name,
                password:hash,
                email: req.body.email,
            }, function(err,user){
                if(err){console.log('error in creating user while signing up',err); return}
                req.flash('success', 'Profile created successfully');
                return res.redirect('/users/signin');
            });
        }else{
            return res.redirect('back');
        }
    });
}

//sign In and go to session
module.exports.createSession = function(req,res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

//signOut handling
module.exports.destroySession = function(req,res){
    req.logout(function(err){
        if(err){
            console.log("error while logout");
        }   
    });
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
} 

// Email send handling for otp
module.exports.emailSend = async function(req,res){
    console.log(req.body);
    let data = await User.findOne({email:req.body.email});
    console.log(data);
    const response = {};
    if(data){
        let otpcode = Math.floor((Math.random()*10000)+1);
        let otpData = new Otp({
            email:req.body.email,
            code:otpcode,
            expireIn: new Data().getTime() + 300*1000
        })
        let otpResponse = await otpData.save();
        response.statusText = 'Success'
        response.message = 'Please check your Email Id';
    }else{
        response.statusText = 'Error'
        response.message = 'Email Id not Exist';
    }
    res.status(200).json(response);
}

// Change password handling 
module.exports.handleChangePassword = async function(req,res){
    //checking the password and new password
    if(req.body.new_password != req.body.confirm_password){
        req.flash('error', 'New Password and confirm password does not match');
        return res.redirect("back");
    }
    try{
        // checking the current given password and old password
        if(!bcrypt.compareSync(req.body.password, req.user.password)){
        req.flash('error', 'You Entered Wrong Password');
        return res.redirect('back');
        }
    // updating the password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.new_password, salt);
    const result = await User.updateOne( { _id: req.user.id },
    {
      $set: {password: hash},
    });

    if (result.modifiedCount === 1) {
        req.flash('success', 'Password Updated Successfully');
        return res.redirect('/');
      } else {
        req.flash('error', 'User not found');
        return res.redirect('back');
      }
    }catch(err) {
        console.log("An error occurred while updating the password.",err);
        return ;
    }
}
