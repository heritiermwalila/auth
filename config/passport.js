const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const UserModel = require('../app/models/User')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'}, (email, password, done)=>{
            UserModel.findOne({email:email})
                .then(user=>{
                    if(!user){
                        return done(null, false, {message:'This email is not registered'})
                    }
                    //match the password
                    bcrypt.compare(password, user.password, (error, res)=>{
                        if(error) throw error
                        if(res){
                            return done(null, user)
                        }else{
                            return done(null, false, {message:'Password is incorrect'})
                        }
                    })
                })
                .catch(error=>console.log(error))
        })
    )

    passport.serializeUser((user, done) =>{
        done(null, user.id);
      });
      
    passport.deserializeUser((id, done) =>{
    UserModel.findById(id, (err, user) =>{
        done(err, user);
    });
    });
}