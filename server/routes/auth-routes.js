const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {scope: ['profile']}));

router.get('/google/callback', passport.authenticate('google', {failureRedirect:'/auth/google', failureFlash:'Bad Login'}),
    function(req, res){
        //if successful, attaches info to request in req.user
        res.send(req.user);
});

module.exports = router;