const express = require('express')
const app = express() ;
const path = require('path');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const model = require('./model/model')
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken') ;
const JWT_SECRET = "sfsdfljsldjfdsoeuw234312@3squeewr32sdfnjk23";

// database connection 
mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(console.log('connected')).catch(err => console.loge(err));



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors()) ;

app.post('/register', async (req,res) =>{
    const {username,password:plainText} = req.body ;
    // console.log(username,plainText) ;
    res.setHeader('Content-Type','appliction/json');

    // validate the user input 
    if(!username){
       return res.json({status:'error', error:'username can not be empty'})
    }
    if(username.length<6){
        return res.json({status:'error',error:'username must be 6 character long'});
    }
    if(plainText.length<6){
        return res.json({status:'error',error:'password must be 6 character long'});
    }
    if(!plainText){
       return res.json({status:'error', error:'password can not be empty'})
    }
    // Hash the password
    const password =  await bcrypt.hash(plainText,10)
    try{
        const result = await model.create({
            username,password
        });
        console.log(result);
        return res.json({status:'ok'});
    }
    // debug
    catch(err){
        console.log(err);
        return res.json({status:'error'});
    }
   
})


app.post('/login', async (req,res) =>{
    const {username,password} = req.body ;
    // console.log(username,password) ;
    res.setHeader('Content-Type','appliction/json');
    
    try{
       const result = await model.findOne({username}).lean() ;
        // console.log(result);
        if(result  && await bcrypt.compare(password, result.password)){
            console.log('login successful');
            const token = jwt.sign({
                id: result._id,
                username: result.username
            }, JWT_SECRET);
            res.cookie('Access_Token', token,{
                httpOnly:true,
                maxAge: 2 * 60 * 60 * 1000
            });
        }
        else{
            console.log('login failed');
            return res.json({status:'error', error:'invalid username/password'})
        }
        
      
    }
    catch(err){
        console.log(err);
        return res.json({status:'error'});
    }
    return res.json({status:'ok'});
})


app.listen(11000,() =>{
    console.log('runing at 11000')
})