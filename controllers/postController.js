
const cloudinary = require('cloudinary').v2;
const path = require('path');

const Post = require('../models/post');
const uploadPhoto = require('../utils/imageUpload');
const deleteImage = require('../utils/deleteImage');



//multer middleware
const multerMiddleware = (req, res, next) => {

    uploadPhoto(req, res, (err) => {
        if (err){
            // console.log(err);
            return res.status(400).json({
                status: 'fail',
                error: err
            });
        }else{
            next();
        }
    });
}




const createNewPost = async (req, res, next) => {

    // console.log(req.user);
    //validate
    if (!req.file || !req.body.description){
        return res.status(400).json({
            status: 'fail',
            error: 'Image and description are required'
        });
    }
    
    
    try{

        const newPost = new Post({
            imageURL: req.file.filename,
            description: req.body.description,
            author: req.user.id,
            likes: [],
            comments: []
        });
        const cloudinaryRes = await cloudinary.uploader.upload(path.join(__dirname, '..', 'public', 'images', req.file.filename));

        if (cloudinaryRes){
            deleteImage(newPost.imageURL);
            newPost.imageURL = cloudinaryRes.url;
        }

        await newPost.save();
        const post = await Post.findById(newPost._id).populate('author');
        res.status(201).json({
            status: 'success',
            data: {
                // post: newPost
                post: post
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }


}

const getAllPosts = async (req, res, next) => {

    try{

        const posts = await Post.find().populate('author');
        
        res.status(200).json({
            status: 'success',
            data: {
                posts: posts
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
    

}

const getSpecificPost = async (req, res, next) => {

    try{
        const post = await Post.findOne({_id: req.params.postId});
        if (!post){
            return res.status(400).json({
                status: 'fail',
                error: 'Post not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                post: post
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }

}

const editPost = async (req, res, next) => {

    try{
        const post = await Post.findOne({_id: req.params.postId});
        if (!post){
            return res.status(400).json({
                status: 'fail',
                error: 'Post not found'
            });
        }
        // console.log(req.user.id);
        // console.log(post.author._id);
        if (req.user.id != post.author._id){
            return res.status(401).json({
                status: 'fail',
                error: 'Unauthorized'
            });
        }

        const body = {
            dateCreated: Date.now()
        };
        if (req.file){
            // deleteImage(post.imageURL);
            // body.imageURL = req.file.filename

            const cloudinaryRes = await cloudinary.uploader.upload(path.join(__dirname, '..', 'public', 'images', req.file.filename));
            // console.log(cloudinaryRes);
            if (cloudinaryRes){
                body.imageURL = cloudinaryRes.url;
                
                const public_id_Arr = post.imageURL.split('/');
                const public_id = public_id_Arr[public_id_Arr.length - 1].split('.')[0];
                await cloudinary.uploader.destroy(public_id);
                deleteImage(req.file.filename);
            }
        }
        if (req.body.description){
            body.description = req.body.description
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, body, {new: true, runValidators: true}).populate('author');
        
        res.status(201).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }

}

const deletePost = async (req, res, next) => {

    try{

        const post = await Post.findById(req.params.postId);
        if (!post){
            return res.status(400).json({
                status: 'fail',
                error: 'No post found'
            });
        }

        if (req.user.id != post.author._id){
            return res.status(401).json({
                status: 'fail',
                error: 'Unauthorized'
            });
        }

        // deleteImage(post.imageURL);
        const public_id_Arr = post.imageURL.split('/');
        const public_id = public_id_Arr[public_id_Arr.length - 1].split('.')[0];
        await cloudinary.uploader.destroy(public_id);

        await Post.findByIdAndDelete({_id: req.params.postId});

        res.status(200).json({
            status: 'success',
            message: 'Post successfully deleted'
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}


const likePost = async (req, res, next) => {

    try{
        const post = await Post.findById(req.params.postId);
        if (!post){
            return res.status(400).json({
                status: 'fail',
                error: 'No post found'
            });
        }

        const userId = req.user.id;
        let currentLikesArray = post.likes;
        currentLikesArray = [...currentLikesArray, userId];
        const body = {likes: currentLikesArray};

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, body, {new: true, runValidators: true}).populate('author');

        res.status(201).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}

const unlikePost = async (req, res, next) => {

    try{
        const post = await Post.findById(req.params.postId);
        if (!post){
            return res.status(400).json({
                status: 'fail',
                error: 'No post found'
            });
        }

        const userId = req.user.id;
        let currentLikesArray = post.likes;
        currentLikesArray = currentLikesArray.filter(elem => elem !== userId);
        const body = {likes: currentLikesArray};

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, body, {new: true, runValidators: true}).populate('author');

        res.status(201).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}


const addComment = async (req, res, next) => {

    try{
        const post = await Post.findById(req.params.postId);
        if (!post){
            return res.status(400).json({
                status: 'fail',
                error: 'No post found'
            });
        }
        

        const userId = req.user.id;
        let commentsArray = post.comments;
        commentsArray = [...commentsArray, {authorId: userId, ...req.body}];
        const body = {comments: commentsArray};

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, body, {new: true, runValidators: true}).populate('author');
        // console.log(updatedPost);

        res.status(201).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        });


    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}


const removeComment = async (req, res, next) => {

    try{

        const post = await Post.findById(req.params.postId);
        if (!post){
            return res.status(400).json({
                status: 'fail',
                error: 'No post found'
            });
        }

        const userId = req.user.id;
        let commentsArray = post.comments;
        commentsArray = commentsArray.filter((elem, i) => {
            if (i !== req.body.key ){
                return elem;
            }
        });
        // console.log(commentsArray);
        const body = {comments: commentsArray};

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, body, {new: true, runValidators: true}).populate('author');


        res.status(201).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        });


    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });

    }
}



module.exports = {
    createNewPost: createNewPost,
    getAllPosts: getAllPosts,
    getSpecificPost: getSpecificPost,
    editPost: editPost,
    deletePost: deletePost,
    multerMiddleware: multerMiddleware,
    likePost: likePost,
    unlikePost: unlikePost,
    addComment: addComment,
    removeComment: removeComment
}