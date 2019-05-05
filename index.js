const express = require('express')
const EjsLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const app = express()



app.use(EjsLayout)
app.set('view engine', 'ejs')
//BODY PARSER
// app.use(express.urlencoded({extended:false}))
app.use(bodyParser.urlencoded({extended:false}))

//EXPRESS SESSION
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }))

//PASSPORT CONFIG AND MIDLEWARE
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

//CONNECT FLASH
app.use(flash())

//GLOBAL VARS
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})



//ROUTE CONFIG
app.use('/', require('./app/routes/public'))
app.use('/user/', require('./app/routes/user'))


//DB CONFIG

const db = require('./config/keys').dbURI

mongoose.connect(db, {useNewUrlParser:true})
    .then(()=>console.log('CONNECTED TO DB'))
    .catch(error=>console.log(error))


const PORT = process.env.PORT || 4500

app.listen(PORT, console.log(`App running of port ${PORT}`))