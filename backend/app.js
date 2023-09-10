const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { registroUsuario, iniciarSesion,obtenerDatosUsuarioPorCorreo } = require('./controller');

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
            console.log("Error en el inicio de sesión: ", error);
            res.status(401).json(error);
        } else {
            console.log("Inicio de sesión exitoso");
            res.status(200).json(resultado);
        }
    });
});

app.get('/usuario/:correo', (req, res) => {
    const correoElectronico = req.params.correo;

    obtenerDatosUsuarioPorCorreo(correoElectronico, (error, datosUsuario) => {
        if (error) {
            console.log("Error al obtener los datos del usuario: ", error);
            res.status(404).json(error);
        } else {
            console.log("Datos del usuario obtenidos con éxito: ", datosUsuario);
            res.status(200).json(datosUsuario);
        }
    });
});

const puerto = 3000;

app.listen(puerto, () => {
    console.log(`api funcionando en el puerto ${puerto}`);
});

