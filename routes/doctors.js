const express = require('express');
const app = express();
const mdAuth = require('../middlewares/auth');
const  Doctor = require('../models/doctor');

app.get('/', (req,res) => {
    let offset = req.query.offset || 0;
    offset = Number(offset);

    Doctor.find({ })
        .skip(offset)
        .limit(5)
        .populate('user','name email')
        .populate('hospital')
        .exec( (errors, doctors)=>{
            if (errors){
                return  res.status(500).json({
                    ok:false,
                    message:'Error base de datos',
                    errors
                })
            }
            Doctor.count({},(errors,count)=>{
                if (errors){
                    return  res.status(500).json({
                        ok:false,
                        message:'Error base de datos',
                        errors
                    })
                }
                res.status(200).json({
                    ok:true,
                    doctors,
                    count
                })
            })
    });

});

app.post('/',mdAuth.verifyToken,(req,res) => {

    const body = req.body;
    const userLogin = req.userLogin;
    console.log(userLogin);
    const doctor = new Doctor({
        name: body.name,
        img: body.img,
        user: userLogin._id,
        hospital: body.hospital,
    });

    doctor.save( (errors,doctor)=>{
        if (errors){
            return res.status(400).json({
                ok:false,
                message:'Error al intentar crear un doctor',
                errors
            })
        }
        res.status(201).json({
            ok:true,
            doctor,
            userLogin
        })
    } );
});

app.put('/:id',mdAuth.verifyToken, (req,res) => {

    const id = req.params.id;
    const body = req.body;
    const userLogin = req.userLogin;

    Doctor.findById(id,(errors, doctor)=>{
        if (errors){
            return res.status(500).json({
                ok:false,
                message:'Error al buscar usuario',
                errors
            })
        }

        if(!doctor){
            return res.status(400).json({
                ok:false,
                message:'El usuario no existe',
                errors
            })
        }

        doctor.name = body.name;
        doctor.img  = body.img;
        doctor.hospital = body.hospital;

        doctor.save((errors,doctor)=>{
            if (errors){
                return res.status(400).json({
                    ok:false,
                    message:'Error al guardar cambios del doctor',
                    errors
                })
            }
            res.status(200).json({
                ok:true,
                doctor,
                userLogin
            });
        });
    });

});

app.delete('/:id',mdAuth.verifyToken, (req,res) => {
    const id = req.params.id;
    const userLogin = req.userLogin;
    Doctor.findByIdAndRemove(id,(errors, doctor)=>{
        if (errors){
            return res.status(500).json({
                ok:false,
                message:'Error al eliminar doctor',
                errors
            })
        }

        if(!doctor){
            return res.status(400).json({
                ok:false,
                message:'El doctor no existe',
                errors
            })
        }
        res.status(200).json({
            ok:true,
            doctor,
            userLogin
        });

    });

});


module.exports = app;