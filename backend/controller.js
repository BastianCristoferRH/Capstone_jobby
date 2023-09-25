const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function registroUsuario(usuario, callback) {
  const sql = 'INSERT usuario (correo_electronico, nombre, apellidos, telefono, fecha_creacion, fecha_nacimiento, password, img) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
  const valores = [
    usuario.correo_electronico,
    usuario.nombre,
    usuario.apellidos,
    usuario.telefono,
    usuario.fecha_creacion,
    usuario.fecha_nacimiento,
    usuario.password,
    usuario.img,
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


//function agregarServicio(req, res) {
// Recuperar los datos del cuerpo de la solicitud
//  const {  des_serv, presencial, id_trabajador, id_serv, id_comuna, id_region } = req.body;

// Validar los datos (agregar más validaciones según tus necesidades)
//if (!des_serv || typeof presencial !== 'boolean' || !id_trabajador ||!id_serv || !id_comuna || !id_region) {
//return res.status(400).json({ error: 'Faltan campos obligatorios' });
// }

// Insertar el servicio en la base de datos
//   const servicio = {  des_serv, presencial, id_trabajador, id_serv, id_comuna, id_region };

// db.query('INSERT INTO descrip_servicio SET ?', servicio, (err, result) => {
// if (err) {
// console.error('Error al agregar el servicio', err);
//res.status(500).json({ error: 'Error al agregar el servicio' });
//} else {
//console.log('Servicio agregado con éxito');
//res.status(200).json({ message: 'Servicio agregado con éxito' });
// }
//});
//}
function agregarServicio(serviceData, callback) {
  // Validar el token del trabajador aquí (debe implementarse)

  // Insertar el servicio en la base de datos
  db.query('INSERT INTO descrip_servicio (des_serv, presencial, id_trabajador, id_serv, id_comuna, id_region) VALUES (?, ?, ?, ?, ?, ?)', [serviceData.des_serv, serviceData.presencial, serviceData.id_trabajador, serviceData.id_serv, serviceData.id_comuna, serviceData.id_region], (err, result) => {
    if (err) {
      console.error('Error al agregar el servicio:', err);
      callback({ error: 'Error interno al agregar el servicio', details: err.message }, null);
    } else {
      console.log('Servicio agregado con éxito');
      callback(null, { message: 'Servicio agregado con éxito' });
    }
    // ...
  })
};

function enviarSolicitud(solicitudData, callback) {
  const sql = 'INSERT INTO solicitud (id_trabajador, id_des_serv, correo_electronico, titulo_solicitud, estado, fecha_solicitud,des_solicitud) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const valores = [
    solicitudData.id_trabajador,
    solicitudData.id_des_serv,
    solicitudData.correo_electronico,
    solicitudData.titulo_solicitud,
    solicitudData.estado,
    new Date(),
    solicitudData.des_solicitud,
  ];

  db.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error('Error al agregar la solicitud:', err);
      callback({ error: 'Error interno al agregar la solicitud', details: err.message }, null);
    } else {
      console.log('Solicitud agregada con éxito');
      callback(null, { message: 'Solicitud enviada con éxito' });
    }
  });
}

function obtenerDatosTrabajadorPorCorreo(correoElectronico, callback) { // es para la solicitud
  const sql = `
  SELECT trabajador.id_trabajador,
  descrip_servicio.id_des_serv,
  servicio.name_serv,
  descrip_servicio.des_serv,
  usuario.correo_electronico,
  usuario.nombre,
  usuario.apellidos,
  usuario.img,
  usuario.telefono,
  usuario.fecha_nacimiento
      FROM trabajador
      JOIN descrip_servicio ON descrip_servicio.id_trabajador = trabajador.id_trabajador
      JOIN servicio ON servicio.id_serv = descrip_servicio.id_serv
      JOIN usuario ON usuario.correo_electronico = trabajador.correo_electronico  
      WHERE trabajador.correo_electronico = ?
  `;
  const valores = [correoElectronico];

  db.query(sql, valores, (err, datosTrabajador) => {
    if (err) {
      console.error('Error al obtener los servicios solicitados:', err);
      callback({ error: 'Error interno al obtener los servicios solicitados', details: err.message }, null);
    } else {
      console.log('Servicios solicitados obtenidos con éxito');
      callback(null, datosTrabajador);
    }
  });
  
}











module.exports = {
  registroUsuario,
  iniciarSesion,
  agregarServicio,
  obtenerDatosUsuarioPorCorreo,
  enviarSolicitud,
  obtenerDatosTrabajadorPorCorreo
};
