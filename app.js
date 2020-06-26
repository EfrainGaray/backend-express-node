//require
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connection.openUri('mongodb://localhost:27017/hospital',(err,res)=>{
    if (err) throw err;
    console.log('Base de datos!!! \x1b[32m%s\x1b','online');
});

//import rutas
appRoute = require('./routes/app');
userRoute = require('./routes/user');
authRoute = require('./routes/auth');


app.use('/users',userRoute);
app.use('/auth',authRoute);
app.use('/',appRoute);

app.listen(3000,()=>{
    console.log('Gooo!!! \x1b[32m%s\x1b','online');
});