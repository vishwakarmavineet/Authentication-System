const express = require('express');
const env = require('./config/environment');
const app = express();
const port = 8000;
const expressLayout = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');

const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path, 'scss'),
    dest: path.join(__dirname, env.asset_path, 'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

//to get the post request
app.use(express.urlencoded());

//using the cookie parser
app.use(cookieParser());

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

//using the express layout
app.use(expressLayout);

//using static files
app.use(express.static(env.asset_path));

// extracting styles and scripts from subpages to layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codial',
    //TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge:(1000* 60 * 100)
    },
    store: MongoStore.create({
    // store: new MongoStore({
            mongoUrl: ('mongodb://127.0.0.1:27017/codial_devlopment'),
            mongooseConnection: db,
            autoRemove: 'disabled'
    },
    function(err){
        if(err){
            console.log("error in mongo store using" , err);
        }else{
            console.log("mongo store is working fine");
        }
        
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//Always use flash after session 
app.use(flash());
app.use(customMware.setFlash);

// using the express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error is showing while running express server: ${err}`);
    }

    console.log(`Your express server is now live on port: ${port}`);
});