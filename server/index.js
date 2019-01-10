const express = require('express');
const passport = require('passport');
const keys = require('./config/keys');
const profileRoutes = require('./routes/profile-routes.js');
const authRoutes = require('./routes/auth-routes');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('./modules/Users');
const cookieSession = require('cookie-session');
const app = express();

app.use(cookieSession({
    maxAge: 2*60*60*1000,
    keys: [keys.cookieKey]
}));

mongoose.connect(keys.MONGO_URI, { useNewUrlParser:true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

//passport middlewares
//initialize passport
app.use(passport.initialize());
//use session cookies
app.use(passport.session());

passport.serializeUser(function(user, done){
    //user.id created by mongodb even tho stored as _id
    //null is the error, but won't have any bc user is a param auto created whenever logged in
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id)
        .then(user => done(null, user));
});

//done only in use if storing the profile in the user session 
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleSecret,
    callbackURL: '/auth/google/callback'
}, function(accessToken, refreshToken, profile, done){
    User.findOne({ googleID:profile.id }).then(currentUser => {
        if(currentUser){
            console.log("User is" + currentUser);
        }else{
            new User({googleID: profile.id})
                .save()
                .then((newUser) => console.log("New User created " + newUser));
        }
        done(null, currentUser);
        });
    }
));

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.json({
        Message: "Hello World!"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Listening on " + PORT));

/*

Sessions are a way of temporarily persisting state (data) between requests. This is commonly used to 'remember' that a user is logged in. Check out this SO answer 484 for more of an explanation of sessions (and cookies).

As for the functions serializeUser and deserializeUser, there's a good explanation here 2.0k. The TL;DR is that the functions tell Passport.js how to get information from a user object to store in a session (serialize), and how to take that information and turn it back into a user object (deserialize). 
*/