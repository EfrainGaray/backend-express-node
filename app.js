//require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/img'));
mongoose.connection.openUri('mongodb://localhost:27017/hospital',(err,res)=>{
    if (err) throw err;
    console.log('Base de datos!!! \x1b[32m%s\x1b','online');
});

//import rutas
appRoute = require('./routes/app');
userRoute = require('./routes/user');
authRoute = require('./routes/auth');
hospitalRoute = require('./routes/hospital');
doctorRoute = require('./routes/doctors');
searchRoute = require('./routes/search');
uploadRoute = require('./routes/upload');
imgRoute = require('./routes/img');

app.use('/img',imgRoute);
app.use('/hospitals',hospitalRoute);
app.use('/doctors',doctorRoute);
app.use('/users',userRoute);
app.use('/auth',authRoute);
app.use('/search',searchRoute);
app.use('/upload',uploadRoute);
app.use('/',appRoute);

app.listen(3000,()=>{
    console.log('Gooo!!! \x1b[32m%s\x1b','online');
});