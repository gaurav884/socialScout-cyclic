const dotenv = require("dotenv").config();
const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require("../models/user")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto")
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SOCIAL_SCOUT_EMAIL,
        pass: process.env.SOCIAL_SCOUT_EMAIL_PASSWORD
    }
})



router.post("/sign-up", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(422).json({ error: "Enter every thing correctly" })
    }


    else {

        User.findOne({ email: email }, (err, found) => {
            if (found) {
                res.json({ error: "email already exist" })
            }
            else {

                bcrypt.hash(password, 12).then(hashedPassword => {

                    const newone = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPassword
                    })

                    newone.save()
                    res.json("Account created Succuessfully")
                })


            }
        })


    }
})

router.post("/sign-in", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.json({ error: "Enter the email and password correctly" })
    }
    else {

        User.findOne({ email: email }).exec((err, found) => {
            if (found) {
                bcrypt.compare(password, found.password).then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: found._id }, process.env.JWT_Secret)
                        res.json({ token: token, user: { _id: found._id, name: found.name, email: found.email, following: found.following, followers: found.followers, profilePhoto: found.profilePhoto, coverPhoto: found.coverPhoto, requests: found.requests, requested: found.requested } })
                    }
                    else {
                        res.status(403).json({ error: "email and password do not match" })
                    }

                }).catch(err => {
                    console.log(err);
                })


            }
            else {
                res.status(403).json({ error: "not found" });
            }
        })
    }
})

router.post("/forgot-password", (req, res) => {
    
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.json({ error: err })
        }
        else {
            const token = buffer.toString("hex")


            User.findOne({ email: req.body.email }).then(user => {
                if (!user) {
                    
                    res.json({ error: "User not found" })
                }
                else {
                    
                    user.resetToken = token;
                    user.expireToken = Date.now() + 300000;
                    user.save().then((result) => {
                        transporter.sendMail({
                            from: process.env.SOCIAL_SCOUT_EMAIL,
                            to: req.body.email,
                            subject: `Social Scout`,
                            html:`
                             <h1>Password reset request</h1>
                             <h2>Click on the link <a href="https://socialscout7884.herokuapp.com/reset-password/${token}">here</a> to change the password</h2>
                             `
                            
                        }, (err, info) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log(info.response)
                            }
                        })
                    })
                    res.json(`check your email`)
                }
            })
        }
    })
})

router.put("/reset-password", (req, res) => {
      const sentToken = req.body.resetToken;
      const newPass = req.body.newPass;

      User.findOne({resetToken:sentToken , expireToken:{$gt:Date.now()}}).then(user=>{
          if(!user){
              res.json({error:"token has expired"})
          }
          else{
            bcrypt.hash(newPass, 12).then(hashedPassword => {
              user.password = hashedPassword;
              user.resetToken = undefined;
              user.expireToken = undefined;
              user.save().then(result=>{
                  res.json({message:"updated sucessfully"})
              })
            
            })
          }
      })
      .catch(err=>{
          res.json({ error: err })
      })
})



module.exports = router;