//require
var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connection.openUri('mongodb://localhost:27017/hopital',(err,res)=>{
    if (err) throw err;

    console.log('Base de datos!!! \x1b[32m%s\x1b','online');
})
app.get('/', (req,res,next) => {
   res.status(200).json({
       ok:true,
       message:'Tudo bem!!'
   })
});
app.listen(3000,()=>{
    console.log('Gooo!!! \x1b[32m%s\x1b','online');
});