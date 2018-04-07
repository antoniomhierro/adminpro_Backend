var express = require('express');
var app = express();

// Ruta para hacer peticiones a la raiz
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion correcta'
    })
});

// Lo hago exportable para poder utilizarlo desde fuera
module.exports = app;