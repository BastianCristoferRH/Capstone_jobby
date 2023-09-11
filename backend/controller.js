const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function registroUsuario(usuario, callback) {
    const sql = 'INSERT usuario (correo_electronico, nombre, apellidos, telefono, fecha_creacion, fecha_nacimiento, conexion, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const valores = [
        usuario.correo_electronico,
        usuario.nombre,
        usuario.apellidos,
        usuario.telefono,
        usuario.fecha_creacion,
        usuario.fecha_nacimiento,
        usuario.conexion,
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
        console.log(valores);
        if (err) {
            console.log("Error al consultar la base de datos: ", err);
            callback(err, null);
        } else {
            if (resultados.length === 0) {
                callback({ mensaje: "Correo electrónico o contraseña incorrectos" }, null);
            } else {
                const usuario = resultados[0];
                console.log(datosUsuario.password);
                console.log(usuario.password);
                bcrypt.compare(datosUsuario.password, usuario.password, (error, coincide) => {
                    if (error) {
                        console.log("Error al comparar contraseñas: ", error);
                        callback(error, null);
                    }  else {
                        const token = jwt.sign({ usuarioId: usuario.id }, 'tu_secreto', { expiresIn: '1h' });
                        callback(null, { mensaje: "Inicio de sesión exitoso", token });
                    }
                });
            }
        }
    });
}
function agregarServicio(req, res) {
    // Recuperar los datos del cuerpo de la solicitud
    const { id_serv, id_comuna, id_region } = req.body;
  
    // Validar los datos (agregar más validaciones según tus necesidades)
    if (!id_serv || !id_comuna || !id_region) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
  
    // Insertar el servicio en la base de datos
    const servicio = { id_serv, id_comuna, id_region };
  
    db.query('INSERT INTO descrip_servicio SET ?', servicio, (err, result) => {
      if (err) {
        console.error('Error al agregar el servicio', err);
        res.status(500).json({ error: 'Error al agregar el servicio' });
      } else {
        console.log('Servicio agregado con éxito');
        res.status(200).json({ message: 'Servicio agregado con éxito' });
      }
    });
  }

module.exports = {
    registroUsuario,
    iniciarSesion,
    agregarServicio
};
