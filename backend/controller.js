const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function registroUsuario(usuario, callback) {
    const sql = 'INSERT usuario (correo_electronico, nombre, apellidos, telefono, fecha_creacion, fecha_nacimiento, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const valores = [
        usuario.correo_electronico,
        usuario.nombre,
        usuario.apellidos,
        usuario.telefono,
        usuario.fecha_creacion,
        usuario.fecha_nacimiento,
        usuario.password,
    ];

    db.query(sql, valores, (err, resultado) => {
        if (err) {
            console.log("error al insertar a la base de datos: ", err);
            callback(err, null);
        } else {
            console.log("se ingresaron los valores con éxito: ", resultado);
            callback(null, resultado);
        }
    });
}

function iniciarSesion(datosUsuario, callback) {
    const sql = 'SELECT * FROM usuario WHERE correo_electronico = ?';
    const valores = [datosUsuario.correo_electronico];

    db.query(sql, valores, (err, resultados) => {
        if (err) {
            console.log("Error al consultar la base de datos: ", err);
            callback(err, null);
        } else {
            if (resultados.length === 0) {
                callback({ mensaje: "Correo electrónico o contraseña incorrectos" }, null);
            } else {
                const usuario = resultados[0];


                if (datosUsuario.password === usuario.password) {
                    const token = jwt.sign({ usuarioId: usuario.correo_electronico }, 'tu_secreto', { expiresIn: '1h' }); //cambie el usuario id
                    callback(null, { mensaje: "Inicio de sesión exitoso", token });
                } else {
                    callback({ mensaje: "Contraseña incorrecta" }, null);
                }
            }
        }
    });
}

function obtenerDatosUsuarioPorCorreo(correoElectronico, callback) {
    const sql = 'SELECT * FROM usuario WHERE correo_electronico = ?';
    const valores = [correoElectronico];

    db.query(sql, valores, (err, resultados) => {
        if (err) {
            console.log("Error al obtener los datos del usuario: ", err);
            callback(err, null);
        } else {
            if (resultados.length === 0) {
                callback({ mensaje: "Usuario no encontrado" }, null);
            } else {
                const datosUsuario = resultados[0];
                callback(null, datosUsuario);
            }
        }
    });
}




module.exports = {
    registroUsuario,
    iniciarSesion,
    obtenerDatosUsuarioPorCorreo,
};
