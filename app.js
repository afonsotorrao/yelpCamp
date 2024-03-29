if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const mongoose = require('mongoose')
mongoose.connect(dbUrl)
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require("connect-mongo")

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    secret: 'secretword'
});

app.use(session({
    store,
    name: 'session',
    secret: 'secretword',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use(flash())
app.use(mongoSanitize())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')



const db = mongoose.connection;
    db.on('error', console.error.bind(console, "connection error:"))
    db.once('open', () => {console.log('Database connected')})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)
app.use(express.static(path.join(__dirname,'public')))


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next (new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    console.log(err.message)
    const { statusCode = 500} = err
    if(!err.message) err.message = 'Oh no, something went wrong!'
    console.log(err.message)
    res.status(statusCode).render('error', { err })
})

app.listen(3000, ()  => {
    console.log('Listening on port 3000')
})
