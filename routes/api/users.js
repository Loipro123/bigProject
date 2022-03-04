const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const {check,validationResult} = require('express-validator');
const connectDB = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// @route Get api/users

const User = require('../../models/User');
router.post('/',[
    check('name','Name is required')
    .not()
    .isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more charaters'
    ).isLength({min: 6})
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()
        });
    }
    
    const {name,email,password} = req.body;

    try {
        // See if user exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                errors: [{msg: 'This email is already registed!'}]
            })
        }
        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })
          // Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        // Return jsonwebbtoken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
        { expiresIn : 360000},
        (err,token) => {
            console.log('ksjfksdj')
            if(err) throw err;
            res.json({token: token
            })
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error')
    }
});

module.exports = router;