const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @route Get api/users

// @route Get api/users

const Product = require('../../models/Product');
router.post('/rice',async (req,res) => {
const {group}   = req.body
    try {
        const products = await Product.find( { group: group } )
        res.json(products)
    } catch (error) {
        res.status(500).send('Serve Error')
    }
});

router.post('/search',async (req,res) => {
    const {name}   = req.body
        try {
            const products = await Product.find( { title: { $regex: name } })
            res.json(products)
        } catch (error) {
            res.status(500).send('Serve Error')
        }
});

router.post('/productDetail',async (req,res) => {
    const {id}   = req.body
        try {
            const products = await Product.find( { _id: id})
            res.json(products)
        } catch (error) {
            res.status(500).send('Serve Error')
        }
});

// db.empDetails.find({ "First_Name": { $regex: "Tom" } })
router.post('/',async (req,res) => {
    const {title,price,urlImage,urlLink,group} = req.body;

    try {
       
        product = new Product({
            title,price,urlImage,urlLink,group
        })
          // Encrypt password
       
        await product.save();
        // Return jsonwebbtoken
        return res.status(400).json({
            product: product
        })
    } catch (error) {
        res.status(500).send('Server error')
    }
});
//

router.post('/array',async (req,res) => {
    const {productId,commentText,userName,userId,star} = req.body;
    try {
     await Product.updateOne(
         { "_id":  productId}, {
            $pull: {
                comments: {
                userId: userId
              }
            }
        });
    await Product.updateOne(
            { "_id":  productId},
      {
          $push: {
              comments: {
                  $each: [{commentText,userId,userName,star}],
                  $position: 0
              }
          }
      }
        )

        const products = await Product.find( { _id: productId } )
        // console.log(JSON.parse(products))
        // const comment = await products.json();
        const comment_len = products[0].comments.length;
        let sum = 0;
        for(let i = 0; i< comment_len; i++){
            sum += products[0].comments[i].star
        }


        await Product.findOneAndUpdate({ _id: productId }, {$set: {star: (sum/comment_len).toFixed(1)}})
        // product = new Product({
        //     title,price,urlImage,urlLink,group
        // })
          // Encrypt password
        return res.status(400).json({
            // product: product
            message: "succeess updated"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error can not')
    }
});


router.post('/orderReview',async (req,res) => {
    const {group,_id}   = req.body
        try {
            const products = await Product.find( { group: group } )
            let reviews = products.sort((a, b) => (a.star < b.star) ? 1 : -1).filter((item,idex) => item._id != _id);
            reviews = reviews.filter((item,idex) => idex < 4)
            res.json(reviews)
        } catch (error) {
            res.status(500).send('Serve Error')
        }
    });



        
module.exports = router;