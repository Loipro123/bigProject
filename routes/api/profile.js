const express = require('express');
const router = express.Router();
const User = require('../../models/User');
// @route Get api/users


router.post('/', async(req,res)=> {
    try {
        const {_id,img} = req.body;
        await User.updateOne(
            { "_id":  _id},
            {
                $push: {
                    avatar: {
                        $each: [img],
                        $position: 0
                    }
                }
            }
            )
        const user = await User.findById(_id).select('-password');
        res.json(user)
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;