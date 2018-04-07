// Crea una nueva ruta
var express = require('express');

// Para encriptar la password
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');

// Para crear el token
var jwt = require('jsonwebtoken');

var app = express();

// Importo el modelo Usuario
var Usuario = require('../models/usuario');

// ====================================
// Trae todos los usuarios
// ====================================
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
});

// ====================================
// Actualiza un usuarios
// ====================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: err
            });
        }

        // Si ha llegado hasta aquí es que ha conectado bien y ha encontrado al usuario

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el ususario',
                    errors: err
                });
            }

            usuario.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});


// ====================================
// Crear nuevo usuario
// ====================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });

});

// ====================================
// Borrar usuario
// ====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuari con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });


});

// Lo hago exportable para poder utilizarlo desde fuera
module.exports = app;