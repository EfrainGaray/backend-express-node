const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
app.use(fileUpload());



User = require('./../models/user');
Doctor = require('./../models/doctor');
Hospital = require('./../models/hospital');

app.put('/:collection/:id', (req,res,next) => {
    const collection = req.params.collection;
    const id = req.params.id;
    const collections = ['hospital','doctor','user'];

    if(collections.indexOf(collection) === -1 ){
        return res.status(400).json({
            ok:false,
            errors:{
                message:'Error: en la collection solo se aceptan :' +  collections.toString()
            }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            errors:{
                message:'Error no se encontraron imagenes en el request'
            }
        });
    }

    const imagen = req.files.imagen;
    const tempImage = imagen.name.split('.');
    const extension = tempImage[tempImage.length - 1];
    const extensions = ['jpg','png','gif','jpeg'];
    const newName = `${id}-${new Date().getMilliseconds()}.${extension}`;
    const path = `./uploads/${collection}/${newName}`;

    if(extensions.indexOf(extension) === -1 ){
        return res.status(400).json({
            ok:false,
            errors:{
                message:'Error: solo se aceptan las siguientes extenciones:' +  extensions.toString()
            }
        });
    }
    imagen.mv(path,errors=>{
        if(errors){
            return res.status(500).json({
                ok:false,
                errors
            });
        }
    });
    return attachType ( collection, id, newName, res )

});

const attachType = ( collection, id, newName, res )=>{

    if(collection === 'user'){
        User.findById(id, (errors, user)=>{
            if (errors){
                return  res.status(500).json({
                    ok:false,
                    message:'Error base de datos',
                    errors
                })
            }

            const pathOld = './uploads/' +  collection + '/' + user.img;
            if(fs.existsSync(pathOld)){
                fs.unlink(pathOld, (errors) => {
                    if (errors){
                        return  res.status(500).json({
                            ok:false,
                            message:'Error el eliminar archivo',
                            errors
                        })
                    }
                });
            }
            user.img = newName;
            user.save((errors,userUpdate)=>{
                if (errors){
                    return  res.status(500).json({
                        ok:false,
                        message:'Error base de datos',
                        errors
                    })
                }
                userUpdate.password='LOL';
                res.status(200).json({
                    ok:true,
                    [collection]:userUpdate
                })
            });
        });
    }

    if(collection === 'doctor'){
        Doctor.findById(id, (errors, doctor)=>{
            if (errors){
                return  res.status(500).json({
                    ok:false,
                    message:'Error base de datos',
                    errors
                })
            }
            const pathOld = './uploads/' +  collection + '/' + doctor.img;
            if(fs.existsSync(pathOld)){
                fs.unlink(pathOld, (errors) => {
                    if (errors){
                        return  res.status(500).json({
                            ok:false,
                            message:'Error el eliminar archivo',
                            errors
                        })
                    }
                });
            }
            doctor.img = newName;
            doctor.save((errors,doctorUpdate)=>{
                if (errors){
                    return  res.status(500).json({
                        ok:false,
                        message:'Error base de datos',
                        errors
                    })
                }
                res.status(200).json({
                    ok:true,
                    [collection]:doctorUpdate
                })
            });
        });
    }




    if(collection === 'hospital'){
        Hospital.findById(id, (errors, hospital)=>{
            if (errors){
                return  res.status(500).json({
                    ok:false,
                    message:'Error base de datos',
                    errors
                })
            }
            const pathOld = './uploads/' +  collection + '/' + hospital.img;
            if(fs.existsSync(pathOld)){
                fs.unlink(pathOld, (errors) => {
                    if (errors){
                        return  res.status(500).json({
                            ok:false,
                            message:'Error el eliminar archivo',
                            errors
                        })
                    }
                });
            }
            hospital.img = newName;
            hospital.save((errors,hospitalUpdate)=>{
                if (errors){
                    return  res.status(500).json({
                        ok:false,
                        message:'Error base de datos',
                        errors
                    })
                }
                res.status(200).json({
                    ok:true,
                    [collection]:hospitalUpdate
                })
            });
        });
    }



}



module.exports = app;
