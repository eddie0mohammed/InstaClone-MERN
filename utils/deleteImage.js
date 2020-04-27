
const fs = require('fs');
const path = require('path');

const deleteFile = (filepath) => {
    console.log(filepath);


    fs.unlink(path.join(__dirname, '..', 'public', 'images', filepath), (err) => {
        if (err){
            console.log(err);
            throw (err);
            return ;
        }
    })
}

module.exports = deleteFile;