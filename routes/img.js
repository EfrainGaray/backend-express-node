const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/:collection/:img', (req,res,next) => {
    const collection  = req.params.collection;
    const img  = req.params.img;
    const pathImg = path.resolve(__dirname, `../uploads/${collection}/${img}`);

    if(fs.existsSync(pathImg)){
       return  res.sendFile(pathImg);
    }else{
        const pathNoImg = path.resolve(__dirname, `../assets/no-img.jpg`);
        return  res.sendFile(pathNoImg);
    }

});

module.exports = app;
