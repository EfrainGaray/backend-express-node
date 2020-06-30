const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');

app.get('/all/:q', (req,res,next) => {
    const q = req.params.q;
    const regxp = new RegExp(q,'ig');
    Promise.all([
        searchHospital(q,regxp),
        searchDoctor(q,regxp),
        searchUser(q,regxp)
    ]).then(responses=>{
        res.status(200).json({
            ok:true,
            hospitals:responses[0],
            doctors:responses[1],
            users:responses[2],
        })
    })
});
app.get('/collection/:table/:q', (req,res,next) => {
    const q = req.params.q;
    const table = req.params.table;
    const regxp = new RegExp(q,'ig');
    let promise;
    switch ( table ) {
        case 'doctors':
            promise = searchDoctor(q,regxp);
            break;
        case 'users':
            promise = searchUser(q,regxp);
            break;
        case 'hospitals':
            promise = searchHospital(q,regxp);
            break;
        default:
                return res.status(400).json({
                    ok:false,
                    errors:{
                        message:'Error el los tipos de busquedan son doctors, users, hospitals'
                    }
                });
    }
    promise.then(response=>{
        res.status(200).json({
            ok:true,
            [table]:response
        })
    })
});
const searchHospital = (q, regxp)=>{
    return new Promise((resolve,reject)=>{
        Hospital.find({name:regxp})
            .populate('user','name email')
            .exec((errors,hospitals)=>{
            if(errors){
                reject('Error al buscar hospitales',errors);
            }else{
                resolve(hospitals);
            }
        })
    })
}

const searchDoctor = (q, regxp)=>{
    return new Promise((resolve,reject)=>{
        Doctor.find({name:regxp})
            .populate('user','name email')
            .populate('hospital','name')
            .exec( (errors,doctos)=>{
            if(errors){
                reject('Error al buscar doctores',errors);
            }else{
                resolve(doctos);
            }
        })
    })
}

const searchUser = (q, regxp)=>{
    return new Promise((resolve,reject)=>{
        User.find({},'name email role')
            .or([
                {name:regxp},
                {email:regxp}
            ])
            .exec((errors,users)=>{
                if(errors){
                    reject('Error al buscar usuarios',errors);
                } else{
                    resolve(users);
                }
            });
    })
}
module.exports = app;
