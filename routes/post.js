const express = require('express')
const app = express()
const requireLogin = require('../middleware/requireLogin')
const router = express.Router();
const Post = require("../models/post");
const dotenv = require("dotenv").config();




router.post('/create', requireLogin, (req, res) => {

    const { title, photo } = req.body;

    if (!title && !photo) {
        res.status(422).json({ error: "enter the fields correctly" })
    }
    else{

    req.user.password = undefined

    const newpost = new Post({
        title: title,
        photo: photo,
        postedBy: req.user

    })
    newpost.save()

    res.json("done")

}
})


router.get("/view-all-posts", requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } }).sort("-createdAt").populate("postedBy", "id name profilePhoto").exec((err, post) => {
        if (err || !post) {
            res.status(422).json({ error: `cannot find users's posts` })
        }
        else {
            res.json(post)
        }
    })

})

router.get("/view-my-posts", requireLogin, (req, res) => {

    Post.find(({ postedBy: req.user._id })).populate("postedBy", "name id name profilePhoto").then(found => {
        req.user.password = undefined;
        res.json({ found, user: req.user })

    }).catch(err => {
        console.log(err);
    })
})

router.get("/li-com-info/:postID", requireLogin , (req ,res) =>{

    Post.findOne({_id :req.params.postID}).select("comments likes").populate("comments.postedBy", "name _id profilePhoto").populate("likes", "name _id profilePhoto").then((post=>{
        res.json({post})
    })).catch(err=>{
        res.json({error:err})
    })

})

router.put("/like", requireLogin, (req, res) => {

    Post.findByIdAndUpdate(req.body.postID, { $push: { likes: req.user._id } }, { new: true }).populate("postedBy", "name id name profilePhoto").populate("comments.postedBy", "name _id profilePhoto").exec((err, result) => {
        if (err) {
            res.status(422).json({ error: err })
        }
        else {
            res.json(result);
        }
    })
})


router.put("/dislike", requireLogin, (req, res) => {

    Post.findByIdAndUpdate(req.body.postID, { $pull: { likes: req.user._id } }, { new: true }).populate("postedBy", "name id name profilePhoto").populate("comments.postedBy", "name _id profilePhoto").exec((err, result) => {
        if (err) {
            res.status(422).json({ error: err })
        }
        else {
            res.json(result);
        }
    })
})

router.put("/comment", requireLogin, (req, res) => {

    const comment = {
        text: req.body.text,
        postedBy: req.user
    }
    

        Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true }).populate("postedBy", "name id name profilePhoto").populate("comments.postedBy", "name _id profilePhoto").exec((err, result) => {
            if (err) {
                res.status(422).json({ error: err })
            }
            else {

                res.json(result);
            }
        })

    


})

router.delete("/delete-comment/:post", requireLogin, (req, res) => {
    
    Post.findById({ _id: req.params.post } ).populate("comments.postedBy").exec((err, found) => {
        if (err || !found) {

            res.status(422).json({ error: err })
        }
        else {
            
            const newComments = found.comments.filter( (each)=>{
                return !(each.text === req.body.text && each.postedBy._id.toString() === req.user._id.toString()) ;
            })
            

            Post.findByIdAndUpdate(req.body.postId, { comments: newComments }, { new: true }).populate("comments.postedBy").populate("postedBy", "name id name profilePhoto").exec((err, result) => {
                if (err) {
                    res.status(422).json({ error: err })
                }
                else {
    
                    res.json(result);
                }
            })
        }
    })
    


})


router.delete("/delete/:post", requireLogin, (req, res) => {


    Post.findById({ _id: req.params.post }).populate("postedBy", "_id").exec((err, found) => {
        if (err || !found) {

            res.status(422).json({ error: err })
        }
        else {
            if (found.postedBy._id.toString() === req.user._id.toString()) {

                found.remove().then(result => {
                    res.json(result)
                }).catch(err => {
                    res.json({ error: err })
                })
            }
        }
    })
})

module.exports = router;



