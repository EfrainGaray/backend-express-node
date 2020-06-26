var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


/*
 ==========================================
  Verificar token
 ==========================================
*/
exports.verifyToken = function(req, res, next) {

    const token = req.query.token;
    jwt.verify(token, SEED, (errors, decoded) => {

        if (errors) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: errors
            });
        }

        req.userLogin = decoded.user;

        next();

    });

}