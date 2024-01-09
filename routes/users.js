const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require("../utils/catchAsync")
const User = require('../models/user')
const passport = require('passport')
const {storeReturnTo} = require('../middleware')
const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.createUser))

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)

router.get('/logout', users.logoutUser)

module.exports = router
