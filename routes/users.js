const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require("../controller/user_controller");

// Routing to given pages
router.get('/profile/:id',passport.checkAuthentication, userController.profile);
router.get('/signup', userController.signup);
router.get('/signin', userController.signin);
router.get('/signout', userController.destroySession);
router.get('/change_password', userController.changePassword);
router.post('/create', userController.create);

//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'},
), userController.createSession);

// use google authentication 
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/signin'}), userController.createSession);

// routing all post methods
router.post('/email-send' , userController.emailSend);
router.post('/change-password', userController.handleChangePassword)
module.exports = router;