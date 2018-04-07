// Para crear el token
var jwt = require('jsonwebtoken');

// importo el seed del config
var SEED = require('../config/config').SEED;


// ====================================
// Verificar token - MIDDLEWARE
// ====================================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
}