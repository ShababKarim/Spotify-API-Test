const router = require('express').Router();

router.get('/', function(req,res){
    res.send("Birthday " + req.user);
});

module.exports = router;