const express = require('express');
const router =  express.Router();
const JwtManager = require('../jwt/jwtManager');


router.post('/', function(req,res,next){
    const username = req.body.username;
    const pass = req.body.password;
    if (username === 'Admin' && pass === 'P@ssw0rd') {
        // console.log("username",username);        
        const data = {userName: username, passwors: pass};
        const jwt = new JwtManager();
        const token = jwt.generate(data);
        res.json({status:'success', accessToken:token});
    } else {
        res.json({status:'invalid-user'});
    }
});
module.exports = router;