var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ==================================
// Busqueda por colección
// ==================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    // extraigo el valor de la tabla a buscar
    var tabla = req.params.tabla;

    // extraigo el valor del parámetro
    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'error en los tipos de busqueda',
                error: { message: 'Colección no vália' }
            });

    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});

// ==================================
// Busqueda general
// ==================================
app.get('/todo/:busqueda', (req, res, next) => {

    // extraigo el valor del parámetro
    var busqueda = req.params.busqueda;

    // crea una expresión regular: /busqueda/i que no se puede escribir tal cual por las barras.
    // Lo que hace es agregarle a la busqueda una i de insensible, para que obvie mayusculas, minusculas
    // y lo que va antes y/o después
    var regex = new RegExp(busqueda, 'i');

    // ejecuta un arreglo de promesas y si ok devuelve un array con las respuestas
    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

// La busqueda la hago con una promesa asincrona.
function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email') // enlazo con coleccion usuario y traigo el nombre y el email
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar los hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

// La busqueda la hago con una promesa asincrona.
function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email') // enlazo con coleccion usuario y traigo el nombre y el email
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar los medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

// La busqueda la hago con una promesa asincrona.
// en esta busca en dos campos de la misma coleccion.
function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nobre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;