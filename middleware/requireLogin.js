const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const User = require("../models/user")


module.exports=(req ,res , next) => {
    const {authorization} = req.headers;

    if(!authorization){
      return  res.status(422).json("You must be logged in")
    }

    else{
        const token = authorization.replace("Bearer " , "")
        jwt.verify(token , process.env.JWT_Secret , (err ,payload)=>{
            if(err){
                res.json("you must be logged in ")
            }
            else{
                const {_id} = payload;
                User.findById(_id).then(userdata=>{
                     req.user = userdata;
                     next();
                })

            }

        })
    }

}