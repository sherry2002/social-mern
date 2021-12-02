const express = require('express');
const router = express.Router();
const Post = require('../Models/Post');
const User = require('../Models/User');

//create post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);

    } catch (err) {
        res.status(500).json(err)
    }
});

//update post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json('post updated');

        } else {
            res.status(403).json('you can update only your post')
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

//delete post
router.delete('/:id', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json('post deleted');

        } else {
            res.status(403).json('you can delete only your post')
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

//like post & dislike post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json('you like post')
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json('you unlike post')
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)

    } catch (err) {
        res.status(500).json(err)
    }
});

//all posts in timeline
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err);
    }
});

//get users all post
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router