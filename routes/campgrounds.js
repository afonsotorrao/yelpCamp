const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require ('multer')
const cloudinary = require('cloudinary').v2;
const {storage} = require('../cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const upload = multer({storage})

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/')
    .get(catchAsync (campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync (campgrounds.createCampground))
    

router.route('/:id')
    .get(catchAsync (campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync (campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync (campgrounds.deleteCampground))

router.get('/edit/:id', isLoggedIn, isAuthor, catchAsync (campgrounds.editCampground))

module.exports = router