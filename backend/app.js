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
            console.log("Error en el inicio de sesión: ", error);
            res.status(401).json(error);
        } else {
            console.log("Inicio de sesión exitoso");
            res.status(200).json(resultado);
        }
    });
});

const puerto = 3000;

app.listen(puerto, () => {
    console.log(`api funcionando en el puerto ${puerto}`);
});

