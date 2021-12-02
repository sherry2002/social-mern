const express = require('express');
const router = express.Router();
const Conversation = require('../Models/Conversation');

//new convo
router.post("/", async (req,res)=>{
    const newConversation = new Conversation({
        members : [req.body.senderId,req.body.recieverId]
    });
    try{
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation)
    }catch(err){
         res.status(500).json(err);
    }
})

// router.post("/", async (req, res) => {
//     const newConversation = new Conversation({
//         members: [req.body.senderId, req.body.recieverId],
//     });
//     console.log(newConversation)
//     try {
//         const savedConversation = await newConversation.save();
//         res.status(200).json(savedConversation)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// });


router.get("/:userId", async (req, res) => {

    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get convo

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        })
        res.status(200).json(conversation)

    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;