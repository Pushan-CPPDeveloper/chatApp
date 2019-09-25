 
const mongoose= require('mongoose');
const User=require('../model/model-user');
//const bodyParser= require('body-parser');
const bcrypt =require('bcrypt');
const express= require('express');
const userController=require('../controller/usercontroller')
const router=express.Router();

router.get("/",(req,res) => {
    res.send("Here");
})

router.get('/signup', (req, res)=>{
    User.find().exec().then(result=>{
        res.json({
            message:result
        });
    })
    .catch(err=>{
        res.json({
            error: err
        });
    });
});

router.post('/signup', userController.addUser);

router.post('/login', userController.loginUser);

router.patch('/resetpass', userController.resetpass);

router.post('/forgotpass', userController.forgotpass);

module.exports=router;