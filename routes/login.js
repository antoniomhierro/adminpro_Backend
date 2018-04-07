// Crea una nueva ruta
var express = require('express');

// Para encriptar la password
var bcrypt = require('bcryptjs');

// Para crear el token
var jwt = require('jsonwebtoken');

// importo el seed del config
var SEED = require('../config/config').SEED;



var app = express();

// Importo el modelo Usuario
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    // busca por email
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        // Pete por conexión
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando el usuario',
                errors: err
            });
        }

        // Pete por que no encuentre el usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        // Pete por pass incorrecta
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token !!!
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

        // Por fin el login es correcto
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    });

});




// Lo hago exportable para poder utilizarlo desde fuera
module.exports = app;