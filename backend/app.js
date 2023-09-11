const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { registroUsuario, iniciarSesion } = require('./controller');

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.post('/registro', (req, res) => {
    const datosUsuario = req.body;

    registroUsuario(datosUsuario, (error, resultado) => {
        if (error) {
            console.log("error json registro", error);
            res.status(500).json({ error: 'error al registar usuario', error });
        } else {
            console.log("exito al ingresar los datos");
            res.status(201).json({ mensaje: "Usuario registrado con exito" });
        }
    });
});

app.post('/login', (req, res) => {
    const datosUsuario = req.body;

    iniciarSesion(datosUsuario, (error, resultado) => {
        if (error) {
            console.log("Error en el inicio de sesión: ", datosUsuario);
            res.status(401).json(error);
        } else {
            console.log("Inicio de sesión exitoso");
            res.status(200).json(resultado);
        }
    });
});
app.post('/agregar_servicio', (req, res) => {
    // Validar el token del trabajador aquí
    
    // Insertar el servicio en la base de datos
    const serviceData = req.body;
    db.query('INSERT INTO descrip_servicio SET ?', serviceData, (err, result) => {
      if (err) {
        console.error('Error al agregar el servicio', err);
        res.status(500).json({ error: 'Error al agregar el servicio' });
      } else {
        console.log('Servicio agregado con éxito');
        res.status(200).json({ message: 'Servicio agregado con éxito' });
      }
    });
  });

const puerto = 3000;

app.listen(puerto, () => {
    console.log(`api funcionando en el puerto ${puerto}`);
});

