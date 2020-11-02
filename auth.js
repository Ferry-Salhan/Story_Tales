 const express = require('express');
 const router = express.Router();
 const mongoose = require("mongoose");

const User = mongoose.model("User");
const crypto = require('crypto')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require('../config/keys')
//const {JWT_SECRET} = require('../keys');
const loginMiddleware = require('../middleware/loginMiddleware');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} = require('../config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
      api_key:SENDGRID_API
  }
}))

  // router.get('/',(req,res)=>{
  //     res.send("Hello")
  // });

  // router.get('/protected',loginMiddleware, (req, res) => {
  //   res.send("Hey User..Welcome!!");
  // });

router.post('/signup',(req,res)=>{
    const {name, email, password, pic} = req.body
    if (!email || !password || !name){
      return res.status(202).json({error: "Please add all the fields."});
    }
    //res.json({message: "Posted Successfully..Yayy!!"});
    User.findOne({email: email})
    .then((savedUser) => {
      if(savedUser){
        return res.status(202).json({error: "User has already registered with that E-mail"});
      }
      bcrypt.hash(password, 8)
      .then(hashedpassword => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic
        })
       
        user.save()
        .then(user => {
          res.json({message:"Login Successfully..Yayy!!"});
        })
        .catch(err=>{
          console.log(err)
        })
      })
      // const user = new User({
      //   email,
      //   password,
      //   name
      // })

      // user.save()
      // .then(user => {
      //   res.json({message:"Login Successfully..Yayy!!"});
      // })
      // .catch(err=>{
      //   console.log(err)
      // })
    })

    .catch(err => {
      console.log(err);
    })
});

router.post('/signin', (req, res) =>{
  const {email, password} = req.body;
  if (!email || !password){
    return res.status(404).json({error: "Please add Email or Password"});
  }
  User.findOne({email: email})
  .then (savedUser => {
    if(!savedUser){
      return res.status(404).json({error: "Invalid Email or Password!!"});
    }
    bcrypt.compare(password, savedUser.password)
    .then(doMatch =>{
      if(doMatch){
        //res.json({message: "Successfully Signed in..BOOM!!"});
        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic}})
      }
      else{
        return res.status(404).json({error: "Warning: Invalid Email or Password!!"});
      }

    })
    .catch(err =>{
      console.log(err);
    })
  })
})

router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
      if(err){
          console.log(err)
      }
      const token = buffer.toString("hex")
      User.findOne({email:req.body.email})
      .then(user=>{
          if(!user){
              return res.status(422).json({error:"User dont exists with that email"})
          }
          user.resetToken = token
          user.expireToken = Date.now() + 3600000
          user.save().then((result)=>{
              transporter.sendMail({
                  to:user.email,
                  from:"no-replay@insta.com",
                  subject:"password reset",
                  html:`
                  <p>You requested for password reset</p>
                  <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                  `
              })
              res.json({message:"check your email"})
          })

      })
  })
})


router.post('/new-password',(req,res)=>{
 const newPassword = req.body.password
 const sentToken = req.body.token
 User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
 .then(user=>{
     if(!user){
         return res.status(422).json({error:"Try again session expired"})
     }
     bcrypt.hash(newPassword,12).then(hashedpassword=>{
        user.password = hashedpassword
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then((saveduser)=>{
            res.json({message:"password updated success"})
        })
     })
 }).catch(err=>{
     console.log(err)
 })
})


module.exports = router;