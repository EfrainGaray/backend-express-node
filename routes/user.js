const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const mdAuth = require('../middlewares/auth');

const  User = require('../models/user');

app.get('/', (req,res,next) => {

    let offset = req.query.offset || 0;
    offset = Number(offset);

    User.find({ },'name email img role')
        .skip(offset)
        .limit(5)
        .exec( (errors, users)=>{
            if (errors){
                return  res.status(500).json({
                    ok:false,
                    message:'Error base de datos',
                    errors
                })
            }

            User.count({},(errors,count)=>{
                if (errors){
                    return  res.status(500).json({
                        ok:false,
                        message:'Error base de datos',
                        errors
                    })
                }
                res.status(200).json({
                    ok:true,
                    users,
                    count
                })
            })

    });

});

app.post('/',mdAuth.verifyToken,(req,res) => {

    const body = req.body;
    const userLogin = req.userLogin;
    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save( (errors,userSave)=>{
        if (errors){
            return res.status(400).json({
                ok:false,
                message:'Error al crear usuario',
                errors
            })
        }
        res.status(201).json({
            ok:true,
            userSave,
            userLogin
        })
    } );

 })

app.put('/:id',mdAuth.verifyToken, (req,res) => {
    const id = req.params.id;
    const body = req.body;
    const userLogin = req.userLogin;
    User.findById(id,(errors, user)=>{
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
                message:'El usuario no existe',
                errors
            })
        }

        user.name= body.name;
        user.email= body.email;
        user.img= body.img;

        user.save((errors,userSave)=>{
            if (errors){
                return res.status(400).json({
                    ok:false,
                    message:'Error al guardar usuario',
                    errors
                })
            }
            userSave.password = 'LOL';
            res.status(200).json({
                ok:true,
                userSave,
                userLogin
            });
        });
    });

});

app.delete('/:id',mdAuth.verifyToken, (req,res) => {
    const id = req.params.id;
    const userLogin = req.userLogin;
    User.findByIdAndRemove(id,(errors, userDeleted)=>{
    if (errors){
        return res.status(500).json({
            ok:false,
            message:'Error al eliminar usuario',
            errors
        })
    }

    if(!userDeleted){
        return res.status(400).json({
            ok:false,
            message:'El usuario no existe',
            errors
        })
    }
    userDeleted.password='LOL';
    res.status(200).json({
        ok:true,
        userDeleted,
        userLogin
    });

    });

});



module.exports = app;
