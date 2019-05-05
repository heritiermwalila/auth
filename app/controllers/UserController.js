const UserModel = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')
exports.login = (req, res)=>{
    res.render('login')
}
exports.register = (req, res)=>{
    res.render('register')
}
exports.registerUser = (req, res)=>{
    const {name, email, password, password2 } = req.body
    const errors = []

    //check if fields are 
    if(!name || !email || !password || !password2){
        errors.push({msg:'All fields are required'})
    }
    if(password !== password2){
        errors.push({msg:'Passwords do not match please try again.'})
    }

    if(password.length < 6){
        errors.push({msg:'Password must be at least 6 characters.'})
    }

    if(errors.length > 0){
        res.render('register', {errors, name, email, password})
    }else{
        //check if the user exist
        UserModel.findOne({email:email})
            .then(user=>{
                if(user){
                    errors.push({msg:'This email already exist'})
                    res.render('register', {errors, name, email, password})
                }else{
                    const newUser = new UserModel({
                        name,
                        email,
                        password
                    })
                    //encrypt the password
                    bcrypt.genSalt(10, (error, salt)=>{
                        bcrypt.hash(password, salt, (error, hash)=>{
                            newUser.password = hash;
                            newUser.save()
                                .then(user=>{
                                    req.flash('success_msg', 'You\'re now registered please login')
                                    res.redirect('login')
                                })
                                .catch(error=>console.log(error))
                        })
                    })
                }
            })
    }
}
exports.loginUser = (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect:'profile',
        failureFlash:true,
        failureRedirect:'login'
    })(req, res, next)
}
exports.profile = (req, res)=>{
    
    res.render('profile', {user:req.user})
}
exports.forgetPassword = (req, res)=>{
    res.send('Forget password page')
}

exports.logout = (req, res)=>{
    req.logout()
    req.flash('success_msg', 'You\'re logged out')
    res.redirect('login')
}