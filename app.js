// ---------------------------------------------Requires
// framework web para trabajar con node
var express = require('express');
// conexión a mongoDB
var mongoose = require('mongoose');
// codifica la información
var bodyParser = require('body-parser');

// ---------------------------------------------Inicializar variables
var app = express();

// ---------------------------------------------Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ---------------------------------------------Importación de rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// ----------------------------------------------Conexión a la bbdd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// ----------------------------------------------Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// -----------------------------------------------Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});