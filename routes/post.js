
const express = require('express');

const postController = require('../controllers/postController');
const checkAuth = require('../middlewares/checkAuth');


const router = express.Router();




// @path    POST /post
// @desc    Create new post
// @access  Private
router.post('/', checkAuth, postController.multerMiddleware, postController.createNewPost);


// @path    GET /post
// @desc    Get all posts
// @access  Public
router.get('/', postController.getAllPosts);

// @path    GET /post/:postId
// @desc    Get specific post
// @access  Public
// router.get('/:postId', postController.getSpecificPost);

// @path    PATCH /post/:postId
// @desc    Edit specific post
// @access  Private
router.patch('/:postId', checkAuth, postController.multerMiddleware, postController.editPost);


// @path    DELETE /post/:postId
// @desc    delete specific post
// @access  Public
router.delete('/:postId', checkAuth, postController.deletePost);

// @path    PATCH /post/like/:postId
// @desc    Like post
// @access  Private
router.patch('/like/:postId', checkAuth, postController.likePost);

// @path    PATCH /post/unlike/:postId
// @desc    Unike post
// @access  Private
router.patch('/unlike/:postId', checkAuth, postController.unlikePost);

// @path    PATCH /post/addcomment/:postId
// @desc    add commnet
// @access  Private
router.patch('/addcomment/:postId', checkAuth, postController.addComment);

// @path    PATCH /post/removecomment/:postId
// @desc    remove commnet
// @access  Private
router.patch('/removecomment/:postId', checkAuth, postController.removeComment);


module.exports = router;