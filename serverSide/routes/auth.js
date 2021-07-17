const express = require('express');
const router =  express.Router();
const JwtManager = require('../jwt/jwtManager');


router.post('/', function(req,res,next){
    const username = req.body.username;
    const pass = req.body.password;
    if (username === 'Admin' && pass === 'P@ssw0rd') {
        // console.log("username",username);        
        const data = {userName: username, password: pass, role: "Admin"};
        const jwt = new JwtManager();
        const token = jwt.generate(data);
        res.json({status:'success', accessToken:token, role: 'Admin', userName: username});
    } else if (username === 'Awaab' && pass === 'P@ssw0rd') {
        const data = {userName: username, password: pass, role: "member"};
        const jwt = new JwtManager();
        const token = jwt.generate(data);
        res.json({status:'success', accessToken:token, role: 'member', userName: username});
    } else{
        res.json({status:'invalid-user'});
    }
});
module.exports = router;