const { json } = require('express');
const express = require('express')
const app = express()
const requireLogin = require('../middleware/requireLogin')
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user")
const bcrypt = require('bcrypt');


router.get('/:userId', requireLogin, (req, res) => {

    User.findById({ _id: req.params.userId }).select("-password").then((user) => {

        Post.find({ postedBy: req.params.userId }).populate("postedBy", "id name profilePhoto").populate("comments.postedBy", "name _id profilePhoto").exec((err, post) => {
            if (err || !post) {
                res.status(422).json({ error: `cannot find usrs's posts` })
            }
            else {
                res.json({ user, post })
            }
        })

    }).catch((err) => {
        res.status(422).json({ error: `cannot find user` })
    })
})

router.get('/:userId/influence', requireLogin, (req, res) => {

    User.findById({ _id: req.params.userId }).select("-password").populate("followers", "_id name profilePhoto").populate("following", "_id name profilePhoto").populate("requests", "_id name profilePhoto").populate("requested", "_id name profilePhoto").exec((err, user) => {


        if (err || !user) {
            res.status(422).json({ error: err })
        }
        else {
            res.json({ user })
        }


    })
})


router.put("/request-follow", requireLogin, (req, res) => {

    User.findByIdAndUpdate({ _id: req.body.followId }, {
        $push: { requests: req.user._id }
    }, { new: true }, (err, result) => {
        if (err) {
            res.json({ error: err })
        }
        else {
            User.findByIdAndUpdate({ _id: req.user._id }, {
                $push: { requested: req.body.followId }
            }, { new: true }, (err, result2) => {
                if (err || !result2) {
                    res.json({ error: err });
                }
                else {
                    result.password = undefined;
                    result2.password = undefined;
                    res.json({ result, result2 })
                }
            })
        }

    }
    )
})

router.put("/accept-follow", requireLogin, (req, res) => {

    User.findByIdAndUpdate({ _id: req.user._id }, {
        $pull: { requests: req.body.requesterId }
    }, { new: true }, (err, result) => {
        if (err) {
            res.json({ error: err })
        }
        else {
            User.findByIdAndUpdate({ _id: req.body.requesterId }, {
                $pull: { requested: req.user._id }
            }, { new: true }, (err, result2) => {
                if (err || !result2) {
                    res.json({ error: err });
                }
                else {
                    // result.password = undefined;
                    // result2.password = undefined;
                    // res.json({result , result2 })
                    User.findByIdAndUpdate({ _id: req.user._id }, {
                        $push: { followers: req.body.requesterId }
                    }, { new: true }, (err, result3) => {
                        if (err) {
                            res.json({ error: err })
                        }
                        else {
                            User.findByIdAndUpdate({ _id: req.body.requesterId }, {
                                $push: { following: req.user._id }
                            }, { new: true }, (err, result4) => {
                                if (err || !result2) {
                                    res.json({ error: err });
                                }
                                else {
                                    result.password = undefined;
                                    result2.password = undefined;
                                    res.json({ result, result2, result3, result4 })
                                }
                            })
                        }

                    }
                    )
                }
            })
        }

    }
    )
})

router.put("/decline-follow", requireLogin, (req, res) => {

    User.findByIdAndUpdate({ _id: req.user._id }, {
        $pull: { requests: req.body.followId }
    }, { new: true }).populate("requests", "_id name profilePhoto").exec((err, result) => {
        if (err) {
            res.json({ error: err })
        }
        else {
            User.findByIdAndUpdate({ _id: req.body.followId }, {
                $pull: { requested: req.user._id }
            }, { new: true }, (err, result2) => {
                if (err || !result2) {
                    res.json({ error: err });
                }
                else {
                    result.password = undefined;
                    result2.password = undefined;
                    res.json({ result, result2 })
                }
            })
        }

    }
    )

})

router.put("/cancel-follow", requireLogin, (req, res) => {

    User.findByIdAndUpdate({ _id: req.user._id }, {
        $pull: { requested: req.body.followId }
    }, { new: true }, (err, result) => {
        if (err) {
            res.json({ error: err })
        }
        else {
            User.findByIdAndUpdate({ _id: req.body.followId }, {
                $pull: { requests: req.user._id }
            }, { new: true }, (err, result2) => {
                if (err || !result2) {
                    res.json({ error: err });
                }
                else {
                    result.password = undefined;
                    result2.password = undefined;
                    res.json({ result, result2 })
                }
            })
        }

    }
    )
})


router.put("/unfollow", requireLogin, (req, res) => {

    User.findByIdAndUpdate({ _id: req.body.followId }, {
        $pull: { followers: req.user._id }
    }, { new: true }, (err, result) => {
        if (err) {
            res.json({ error: err })
        }
        else {
            User.findByIdAndUpdate({ _id: req.user._id }, {
                $pull: { following: req.body.followId }
            }, { new: true }, (err, result2) => {
                if (err || !result2) {
                    res.json({ error: err });
                }
                else {
                    result.password = undefined;
                    result2.password = undefined;
                    res.json({ result, result2 })
                }
            })
        }

    }
    )
})

router.post("/search-user", requireLogin, (req, res) => {

    const search = (req.body.query).trim()
 
    if (search === "") {
        res.json({ error: `empty` })
    }
    else {
        const queryReg = new RegExp(`^${search}`);

        User.find({ name: { $regex: queryReg } }).then((found) => {

            res.json({ found })

        }).catch(err => {
            res.json({ error: err })
        })
    }


})

router.put("/change-name", requireLogin, (req, res) => {
    if (req.body.newName === "") {
        res.json({ error: 'please enter all fields correctly' })
    }
    else {
        User.findByIdAndUpdate({ _id: req.user._id }, { name: req.body.newName }, { new: true }).select("-password").then(found => {
            res.json({ found })
        }).catch(err => {
            res.json({ error: err })
        })
    }
})

router.put("/change-password", requireLogin, (req, res) => {
    const { oldPass, newPass } = req.body;
    bcrypt.compare(oldPass, req.user.password).then(doMatch => {
        if (doMatch) {

            bcrypt.hash(newPass, 12).then(hashedPassword => {
                    User.findByIdAndUpdate({ _id: req.user._id } , {password:hashedPassword}).then(done => {
                     
                        res.json("Password updated Succuessfully")

                    }).catch(err => {
                        res.json({ error: err })
                    })
        
                    
                
                })
        }
        else {
            res.status(403).json({ error: "incorrect old password " })
        }

    }).catch(err => {
        console.log(err);
    })

})


router.delete("/delete-account", requireLogin, (req, res) => {
    const { checked, password } = req.body;
    if (!checked || !password) {
        res.json({ error: "please enter all the fields correctly" })
    }
    else {
        bcrypt.compare(password, req.user.password).then(doMatch => {
            if (doMatch) {

                Post.remove({ postedBy: req.user._id }).exec((err, found) => {
                    if (err) {

                        res.status(422).json({ error: err })
                    }
                    else {

                        User.findByIdAndRemove({ _id: req.user._id }, { new: true }).exec((err, done) => {
                            if (done) {
                                res.json({ sucess: "deleted" })

                            }
                            else {
                                res.status(403).json({ error: err });
                            }


                        })


                    }
                })


            }
            else {
                res.status(403).json({ error: "Enter password correctly" })
            }

        }).catch(err => {
            console.log(err);
        })
    }

})
module.exports = router;