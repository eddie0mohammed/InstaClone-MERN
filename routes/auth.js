
const express = require('express');

const authController = require('../controllers/authController');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();



// @path    POST /auth/register
// @desc    Create new user
// @access  Public
router.post('/register', authController.register);

// @path    POST /auth/login
// @desc    Login
// @access  Public
router.post('/login', authController.login);

// @path    GET /auth/activateAccount
// @desc    activate Account
// @access  Private
router.get('/activateAccount/:token', authController.activateAccount);


// @path    POST /auth/request-resetPassword
// @desc    Request to reset password with email
// @access  Public
router.post('/request-resetPassword', authController.askResetPassword);

// @path    GET /auth/resetPassword/:token
// @desc    Go to link from email to resetPassword
// @access  Public
router.get('/resetPassword/:token', authController.redirectToResetPassword);

// @path    POST /auth/resetPassword/:token
// @desc    Post request with new password to reset password
// @access  Public
router.post('/resetPassword/:token', authController.resetPassword);

// @path    GET /auth/getUser
// @desc    Get current user
// @access  Public
router.get('/getUser', checkAuth, authController.getUser);

// @path    PATCH /auth/reset-mypassword
// @desc    Patch request to reset password
// @access  Private
router.patch('/reset-mypassword', checkAuth, authController.resetMyPassword);


// @path    PATCH /auth/changeProfilePic
// @desc    Patch request to change profile picture
// @access  Private
router.patch('/changeProfilePic', checkAuth, authController.multerMiddleware, authController.changeProfilePicture);


module.exports = router;