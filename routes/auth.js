const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

const app = express();
const User = require('../models/user');

app.post('/', (req,res,next) => {
    var body = req.body;
    User.findOne({email:body.email},(errors, user)=>{
        if (errors){
            return res.status(500).json({
                ok:false,
                message:'Error al buscar usuario',
                errors
            })
        }
        if(!user){
            return res.status(400).json({
                ok:false,
                message:'Credenciales incorrectas',
                errors
            })
        }
        if(!bcrypt.compareSync(body.password,user.password)){
            return res.status(400).json({
                ok:false,
                message:'Credenciales incorrectas',
                errors
            });
        }
        user.password = 'LOL';

        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: user,
            token: token,
            id: user._id
        });

    })

});
module.exports = app;