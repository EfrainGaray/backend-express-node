const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

const app = express();
const User = require('../models/user');



// ==========================================
//  Autenticación De Google
// ==========================================
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        name : payload.name,
        email : payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    const token = req.body.token || 'XXX';

    const googleUser = await verify(token).catch(errors=>{
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: errors
            });
    });

    User.findOne({ email: googleUser.email }, (errors, user) => {

        if (errors) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar usuario - login',
                errors: errors
            });
        }

        if (user) {

            if (user.google === false) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Debe de usar su autenticación normal'
                });
            } else {

                user.password = ':)';

                const token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 horas

                res.status(200).json({
                    ok: true,
                    user: user,
                    token: token,
                    id: user._id
                });

            }

            // Si el usuario no existe por correo
        } else {

            const user = new User();


            user.name = googleUser.name;
            user.email = googleUser.email;
            user.password = 'LOL';
            user.img = googleUser.img;
            user.google = true;

            user.save((errors, userDB) => {

                if (errors) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al crear usuario - google',
                        errors: errors
                    });
                }


                var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); // 4 horas

                res.status(200).json({
                    ok: true,
                    user: userDB,
                    token: token,
                    id: userDB._id
                });

            });

        }


    });


});


app.post('/', (req,res,next) => {
    const body = req.body;
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