
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');



//CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


const app = express();



//DB
const DB = process.env.DB;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to DB'))
.catch(err => console.log(err));


//MIDDLEWARES
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//serve static files
app.use('/images' , express.static(path.join(__dirname, 'public', 'images')));


//ROUTES
app.use('/auth', authRouter);
app.use('/post', postRouter);




const PORT = 8080;
app.listen(PORT, () => {
    console.log('Server listening on port ', PORT);
});