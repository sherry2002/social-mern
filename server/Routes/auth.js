const express = require('express');
const router = express.Router();
const User = require('../Models/User')
const bcrypt = require('bcrypt');

//register

router.post('/register', async (req, res) => {
    //gen new password
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //create user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //save user
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }

});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json('user not found');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(404).json('wrong password');
        res.status(200).json(user);


    } catch (err) {
        res.status(500).json(err)
    }

});

//logout

router.get('/logout', async (req, res) => {
    try {
        await req.logout();
        res.redirect('/login');


    } catch (err) {
        res.status(500).json(err)
    }

})

module.exports = router;