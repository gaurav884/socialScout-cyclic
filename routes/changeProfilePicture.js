const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require("../models/user")
const requireLogin = require('../middleware/requireLogin')


router.put("/", requireLogin, (req, res) => {
    
    User.findByIdAndUpdate({_id:req.user._id} , {profilePhoto:req.body.newUrl} , {new:true} , (err ,result)=>{
        if(err ){
            res.json({error:err})
        }
        else{
            console.log(result)
            res.json(result)
        }
    })
})


module.exports = router;