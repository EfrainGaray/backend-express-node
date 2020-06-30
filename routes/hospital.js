const express = require('express');
const app = express();
const  Hospital = require('../models/hospital');
const mdAuth = require('../middlewares/auth');

app.get('/', (req,res) => {
    let offset = req.query.offset || 0;
    offset = Number(offset);
    Hospital.find({ })
        .skip(offset)
        .limit(5)
        .populate('user','name email')
        .exec( (errors, hospitals)=>{
            if (errors){
                return  res.status(500).json({
                    ok:false,
                    message:'Error base de datos',
                    errors
                })
            }
            Hospital.count({},(errors,count)=>{
                if (errors){
                    return  res.status(500).json({
                        ok:false,
                        message:'Error base de datos',
                        errors
                    })
                }
                res.status(200).json({
                    ok:true,
                    hospitals,
                    count
                })
            })
    });
});

app.post('/',mdAuth.verifyToken,(req,res) => {

    const body = req.body;
    const userLogin = req.userLogin;
    const hospital = new Hospital({
        name: body.name,
        img: body.img,
        user: userLogin._id,
    });

    hospital.save( (errors,hospital)=>{
        if (errors){
            return res.status(400).json({
                ok:false,
                message:'Error al intentar crear un hospital',
                errors
            })
        }
        res.status(201).json({
            ok:true,
            hospital,
            userLogin
        })
    } );
})

app.put('/:id',mdAuth.verifyToken, (req,res) => {

    const id = req.params.id;
    const body = req.body;
    const userLogin = req.userLogin;

    Hospital.findById(id,(errors, hospital)=>{
        if (errors){
            return res.status(500).json({
                ok:false,
                message:'Error al buscar usuario',
                errors
            })
        }

        if(!hospital){
            return res.status(400).json({
                ok:false,
                message:'El usuario no existe',
                errors
            })
        }

        hospital.name = body.name;
        hospital.img  = body.img;

        hospital.save((errors,hospital)=>{
            if (errors){
                return res.status(400).json({
                    ok:false,
                    message:'Error al guardar cambios del hospital',
                    errors
                })
            }
            res.status(200).json({
                ok:true,
                hospital,
                userLogin
            });
        });
    });

});

app.delete('/:id',mdAuth.verifyToken, (req,res) => {
    const id = req.params.id;
    const userLogin = req.userLogin;
    Hospital.findByIdAndRemove(id,(errors, hospital)=>{
        if (errors){
            return res.status(500).json({
                ok:false,
                message:'Error al eliminar hospital',
                errors
            })
        }

        if(!hospital){
            return res.status(400).json({
                ok:false,
                message:'El hospital no existe',
                errors
            })
        }
        res.status(200).json({
            ok:true,
            hospital,
            userLogin
        });

    });

});



module.exports = app;