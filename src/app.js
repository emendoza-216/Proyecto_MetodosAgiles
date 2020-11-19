const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
// const lecturaArchivos = require('./modulos/lecturaArchivos');

// Conectando a db.
// mongoose.connect('mongodb://localhost/asistencias-mongo');

// Importando rutas.
const indexRoutes = require('./routes/index');

// Configuración.
app.set('port', process.env.PORT || 3000); // Configurando puerto.
app.set('views', path.join(__dirname, 'views')); // Configurando carpeta views.
app.set('view engine', 'ejs'); // Configurando plantilla de vistas. EJS es js embebido en html.

// Middlewares.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

// Rutas.
app.use('/', indexRoutes);

// Directorio publico de donde se obtienen los archivos estaticos.
app.use(express.static(__dirname + '/public'));

// Iniciando server...
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);

    //lecturaArchivos.prueba();
});