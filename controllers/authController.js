
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const User = require('../models/user');

const uploadPhoto = require('../utils/imageUpload');
const sendMail = require('../utils/sendMail');
const deleteImage = require('../utils/deleteImage');


//MULTER MIDDLEWARE
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

// REGISTER
const register = async (req, res, next) => {

    //validate
    const {username, email, password} = req.body;
    if (!username || !email || !password){
        return res.status(400).json({
            status: 'fail',
            error: 'Username, email and password required'
        });
    }

    try{

        //check if email exists in DB
        const exists = await User.findOne({email: req.body.email});
        if (exists){
            return res.status(400).json({
                status: 'fail',
                error: 'Email exists in DB'
            });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //activationToken
        const activationToken = crypto.randomBytes(32).toString('hex');
        // console.log(activationToken);
        const hashedToken = crypto.createHash('sha256').update(activationToken).digest('hex');

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            activationToken: hashedToken
        });

        await newUser.save();

        //send activation email
        const activationURL = `${req.protocol}://${req.get('host')}/auth/activateAccount/${activationToken}`;
        
        //send email
        await sendMail({
            email: process.env.NODE_ENV === 'development' ? 'test@test.com' : req.body.email,
            subject: 'Activate Your Account',
         
            URL: activationURL,
            emailType: 'activation'
        });

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            },
            message: 'New user successfully created'
        });


    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}

//ACTIVATE ACCOUNT
const activateAccount = async (req, res, next) => {

    let token = req.params.token;
    if (!token){
        return res.status(401).json({
            status: 'fail',
            error: 'Unauthorized'
        });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try{

        const user = await User.findOne({activationToken: hashedToken});
        if (!user){
            return res.status(401).json({
                status: 'fail',
                error: 'Unauthorized'
            });
        }
        user.active = true;
        user.activationToken = null;
        await user.save();

        // res.redirect(`http://localhost:3000/auth/login`);
        res.redirect(`/auth/login`);

    }catch(err){
        consoele.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });

    }

}


//LOGIN
const login = async (req, res, next) => {

    if (!req.body.email || !req.body.password){
        return res.status(400).json({
            status: 'fail',
            error: 'missing credentials'
        });
    }

    try{
        const user = await User.findOne({email: req.body.email});
        if (!user){
            return res.status(400).json({
                status: 'fail',
                error: 'Invalid Credentials'
            });
        }

         //check if user account is activated
        if (!user.active){
            return res.status(400).json({
                status: 'fail',
                error: 'Invalid credentials'
            })
        }

        //check password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch){
            return res.status(400).json({
                status: 'fail',
                error: 'Invalid Credentials'
            });
        }

        //token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: 3600});
        // console.log(token)
        //include token in header
        res.header('auth-token', token);

        res.status(200).json({
            status: 'success',
            data: {
                user: user
            },
            token: token
        });


    }catch(err){
        console.log(err);
        return  res.status(400).json({
            status: 'fail',
            error: err
        });
    }
    
}


const askResetPassword = async (req, res, next) => {

    try{
        // 1. get user based on email
        const user = await User.findOne({email: req.body.email});
        if (!user){
            return res.status(400).json({
                status: 'fail',
                error: 'User not found'
            });
        }

        // 2. generate random token
        //password reset Token
        const passwordResetToken = crypto.randomBytes(32).toString('hex');
        
        const hashedToken = crypto.createHash('sha256').update(passwordResetToken).digest('hex');

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + (10 * 60 * 1000);
        await user.save({validateBeforeSave: false});

        // 3. send email
        //passwordResetURL
        const passwordResetURL = `${req.protocol}://${req.get('host')}/auth/resetPassword/${passwordResetToken}`;

        await sendMail({
            email: process.env.NODE_ENV === 'development' ? 'test@test.com' : req.body.email,
            subject: 'PASSWORD RESET EMAIL',
            emailType: 'forgotPassword',
            URL: passwordResetURL
        });

        res.status(200).json({
            status: 'success',
            message: 'Password reset email sent'
        });


    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }

}

const redirectToResetPassword = (req, res, next) => {
    
    const token = req.params.token;
    // res.redirect(`http://localhost:3000/auth/reset-password/${token}`);
    res.redirect(`/auth/reset-password/${token}`);

}

const resetPassword = async (req, res, next) => {

    try{
        // 1.  get user based on token
        const token = req.params.token;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({passwordResetToken: hashedToken});
        if (!user){
            return res.status(400).json({
                status: 'fail',
                error: 'No user found'
            });
        }

        // 2. Check if token has expired, if token has not expired, and there is user, set the new password
        if (user.passwordResetExpires < Date.now()){
            return res.status(400).json({
                status: 'fail',
                error: 'Token expired'
            });
        }

        //hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //3. update the password
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await user.save({validateBeforeSave: false});

        res.status(201).json({
            status: 'success',
            message: 'Password successfully updated'
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}

const getUser = async (req, res, next) => {

    if (!req.user){
        return res.status(401).json({
            status: 'fail', 
            error: 'Unauthorized'
        });  
    }

    try{

        const user = await User.findById(req.user.id);
        if (!user){
            return res.status(401).json({
                status: 'fail', 
                error: 'Unauthorized'
            });    
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: user
            }
        });

    }catch(err){
        console.log(err);
        res.status(401).json({
            status: 'fail', 
            error: err
        });
    }

}


const resetMyPassword = async (req, res, next) => {
    try{
        // 1. find user by id from token
        const user = await User.findById(req.user.id);
        if (!user){
            return res.status(400).json({
                status: 'fail',
                error: "No user found"
            });
        }

        // 2. check if current password provided matches the one in db
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!isMatch){
            return res.status(400).json({
                status: 'fail',
                error: 'Current Password Invalid'
            });
        }

        // 3. create new hashed password
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(201).json({
            status: 'success',
            data: {
                user: user
            }
        })

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }

}



const changeProfilePicture = async (req, res, next) => {

    try{
        // 1. find user by id from token
        const user = await User.findById(req.user.id);
        if (!user){
            return res.status(401).json({
                status: 'fail',
                error: 'User not found'
            });
        }

        const body = {};
        //2, check if there is a file
        
        if (req.file){

            const cloudinaryRes = await cloudinary.uploader.upload(path.join(__dirname, '..', 'public', 'images', req.file.filename));
            // console.log(cloudinaryRes);
            if (cloudinaryRes){
                body.profilePic = cloudinaryRes.url;
                
                const public_id_Arr = user.profilePic.split('/');
                const public_id = public_id_Arr[public_id_Arr.length - 1].split('.')[0];
                if (cloudinaryRes.url !== 'https://res.cloudinary.com/dwnuffg0b/image/upload/v1587586900/1_x0apjw.jpg'){
                    await cloudinary.uploader.destroy(public_id);

                }
                deleteImage(req.file.filename);
            }
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id, body, {new: true, runValidators: true});

        res.status(201).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        })



    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        });
    }
}


module.exports = {
    register: register,
    login: login,
    activateAccount: activateAccount,
    askResetPassword: askResetPassword,
    redirectToResetPassword: redirectToResetPassword,
    resetPassword: resetPassword,
    getUser: getUser,
    resetMyPassword: resetMyPassword,
    multerMiddleware: multerMiddleware,
    changeProfilePicture: changeProfilePicture,
}