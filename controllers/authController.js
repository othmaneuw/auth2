const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (err) =>{
    let errors = {email : '' , password : ''};
    console.log(err.errors);
    console.log(err.message);
    if(err.message === 'Incorrect Email'){
        console.log("Othmaaane");
        errors.email = "Email not registred";
    }

    
    if(err.message === "Incorrect Password"){
        errors.password = "Password is not registred";
    }

    if(err.code === 11000){
        errors.email = 'The email must be unique';
        return errors;
    }

    if(err.message.includes('user validation failed')){ 
        Object.values(err.errors).forEach(error => {
            errors[error.properties.path] = error.properties.message;
        })
    }
    return errors;
}

const createToken = (id) =>{
    return jwt.sign({id},'secret string',{
        expiresIn:3*24*60*60
    }); 
}

const signup_get = (req,res) =>{
    res.render('signup');
}

const login_get = (req,res) =>{
    res.render('login');
}

const signup_post = async (req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await User.create({email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly : true , maxAge : 1000*60*60*24*3});
        res.status(201).json({user : user._id});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const login_post = async (req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{maxAge : 1000*60*60*24*3 , httpOnly : true});
        res.status(200).json({user : user._id});
    }catch(err){
        const errors = handleErrors(err);
         res.status(400).json({errors});
    }
}

const logout_get = (req,res) =>{
     res.cookie('jwt','',{maxAge:1});
     res.redirect('/login');
}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
}