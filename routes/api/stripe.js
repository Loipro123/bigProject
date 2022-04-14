const express = require('express');
const router = express.Router();
const stripe = require('stripe')("sk_test_x1MOWmOv09Al5TJn5uT9Y6Qi009QyCYb2Q");
const uuid = require("uuid/v4");
const User = require('../../models/User');

router.post('/', async(req,res)=> {
    let error;
    let status;
    try {
        const {
            price,
            userId,
            token,
            cartList,
            tax,
            ship
        } = req.body;
        console.log(req.body)
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
          });
      
        const idempotency_key = uuid();
        const charge = await stripe.charges.create(
          {
            amount: price * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `Purchased the Food`,
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip
              }
            }
          },
          {
            idempotencyKey:idempotency_key
          }
        );
        // console.log("Charge:", { charge });
        status = "success";
        if(userId){
        await User.updateOne(
            { "_id":  userId},{ $pop: { address: -1 } });
        await User.updateOne(
              { "_id":  userId},
        {
            $push: {
                address: {
                    $each: [{Street:token.card.address_line1, Zipcode:token.card.address_zip,City:token.card.address_city,
                    State:token.card.address_state,
                    Country:token.card.country}],
                    $position: 0
                },
                sales:{
                    $each: [{
                      price:Number(price),
                      ship:Number(ship),
                      tax:Number(tax)
                    }],
                    $position: 0
                }
            }
           }
          )
        cartList.map( async item => {
          await User.updateOne(
            { "_id":userId},
            { "$push": 
                {"sales.$[].products": 
                    {
                        "title": item.title,
                        "price": item.price,
                        "amount": item.amount,
                        "urlLink":item.urlLink,
                        "urlImage":item.urlImage,
                        "size":item.valueRadio
                    }
                }
             }
            )
        })
        }
      } catch (error) {
        console.error("Error:", error);
        status = "failure";
      }
    
      res.json({ error, status });
     
    });
module.exports = router;