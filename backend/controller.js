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
  usuario.fecha_nacimiento,
  trabajador.des_perfil,
  comuna.name_comuna,
  region.name_region
      FROM trabajador
      JOIN descrip_servicio ON descrip_servicio.id_trabajador = trabajador.id_trabajador
      JOIN servicio ON servicio.id_serv = descrip_servicio.id_serv
      JOIN usuario ON usuario.correo_electronico = trabajador.correo_electronico  
      JOIN comuna ON descrip_servicio.id_comuna = comuna.id_comuna  
      JOIN region ON region.id_region=descrip_servicio.id_region
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
function agregarServicio(serviceData, callback) {

  const query ='INSERT INTO descrip_servicio (des_serv, presencial, id_trabajador, id_serv, id_comuna, id_region) VALUES (?, ?, ?, ?, ?, ?)';
  const valores = [
    serviceData.des_serv,
    serviceData.presencial,
    serviceData.id_trabajador,
    serviceData.id_serv,
    serviceData.id_comuna,
    serviceData.id_region
  ];

  db.query(query, valores, (err, result)=>{
    if (err) {
      console.error('Error al agregar el servicio:', err);
      callback({ error: 'Error interno al agregar el servicio', details: err.message }, null);
    } else {
      console.log('Servicio agregado con éxito');
      callback(null, { message: 'Servicio agregado con éxito' },result);
    }

  })
    
};

function obtenerServiciosSolicitadosPorTrabajador(correoElectronico, callback) {
  const sql = `
    SELECT 
      usuario.nombre,
      usuario.apellidos,
      usuario.correo_electronico AS correo_cliente,
      trabajador.correo_electronico AS correo_trabajador,
      solicitud.titulo_solicitud,
      solicitud.fecha_solicitud,
      solicitud.id_solicitud,
      solicitud.des_solicitud,
      servicio.name_serv,
      solicitud.estado,
      usuario.telefono
    FROM solicitud
    JOIN usuario ON usuario.correo_electronico = solicitud.correo_electronico
    JOIN trabajador ON trabajador.id_trabajador = solicitud.id_trabajador
    JOIN descrip_servicio ON solicitud.id_des_serv = descrip_servicio.id_des_serv
    JOIN servicio ON descrip_servicio.id_serv = servicio.id_serv
    WHERE trabajador.correo_electronico = ?
  `;

  const valores = [correoElectronico];

  db.query(sql, valores, (err, resultados) => {
    if (err) {
      console.error('Error al obtener los servicios solicitados:', err);
      callback({ error: 'Error interno al obtener los servicios solicitados', details: err.message }, null);
    } else {
      console.log('Servicios solicitados obtenidos con éxito');
      callback(null, resultados);
    }
  });
}


function aceptarSolicitud(solicitudId, nuevoEstado, callback) {
  const sql = 'UPDATE solicitud SET estado = ? WHERE id_solicitud = ?';
  db.query(sql, [nuevoEstado, solicitudId], (err, result) => {
    if (err) {
      console.error('Error al cambiar el estado de la solicitud:', err);
      callback({ error: 'Error al cambiar el estado de la solicitud' }, null);
    } else {
      console.log('Solicitud actualizada con nuevo estado');
      callback(null, { message: 'Solicitud actualizada con nuevo estado' });
    }
  });
}




function obtenerRegiones(callback) {
  const query = 'SELECT * FROM region';
  db.query(query,(error, result) => {
    if (error) {
      console.log("Error al obtener regiones", error);
      callback(error,null)
      return;
      
    }else{
      callback(null,result)
    }
    
  });

}

function obtenerComunas(callback) {
  const query = 'SELECT * FROM comuna';
  db.query(query,(error, result) => {
    if (error) {
      console.log("Error al obtener Comunas", error);
      callback(error,null)
      return;
      
    }else{
      callback(null,result)
    }
    
  });

}

function obtenerServicios(callback) {
  const query = 'SELECT * FROM servicio';
  db.query(query, (error, result)=> {
    if (error) {
      console.log("Error al obtener servicios",error);
      callback(error,null);
      return;
      
    }else{
      callback(null,result)
    }
  })

}

function listarServicios(callback){
  const query = `SELECT ds.des_serv, ds.presencial, t.correo_electronico, t.disponibilidad, name_serv, name_comuna, name_region 
  FROM descrip_servicio ds JOIN trabajador t ON(ds.id_trabajador = t.id_trabajador) 
  JOIN servicio s ON(ds.id_serv = s.id_serv) 
  JOIN region r ON(ds.id_region = r.id_region)
  JOIN  comuna c ON (ds.id_comuna = c.id_comuna)`;
  db.query(query, (error, result) => {
    if (error) {
      console.log("Error al obtener listado de servicios", error);
      callback(error,null);
      return;
    }else{
      callback(null,result)
    }
  })
}


function agregarReseña(reseñaData,callback){
  const query = `INSERT INTO reseña (descripcion, calificacion, id_solicitud) VALUES(?,?,?)`;
  const valores = [
    reseñaData.descripcion,
    reseñaData.calificacion,
    reseñaData.id_solicitud
  ];
  db.query(query, valores, (error, result) => {
    if (error) {
      console.log("Error al agregar reseña",error);
      callback(error,null);
      return;
      
    }else{
      console.log("Exito al agregar reseña",result);
      callback(null,result);
    }

  });
}








function obtenerTrabajadorIdPorCorreo(correoElectronico, callback) {
  const query = `SELECT id_trabajador FROM trabajador WHERE correo_electronico = ?`;
  const valores = [correoElectronico];

  db.query(query, valores, (err, resultados) => {
    if (err) {
      console.error('Error al obtener el trabajador solicitado:', err);
      callback({ error: 'Error interno al obtener el trabajador solicitado', details: err.message }, null);
    } else {
      console.log('Trabajador solicitado obtenidos con éxito');
      callback(null, resultados);
    }
  });

}



function obtenerSolicitudIdPorTrabajadorId(trabajadorId, callback){
  const query = `SELECT id_solicitud, estado FROM solicitud
  WHERE id_trabajador = ? AND estado = 'Finalizado'`;
  const valores = [trabajadorId];
  db.query(query, valores, (error,result)=>{
    if (error) {
      console.log("Error al obtener el idsolicitud en cuestion", error);
      callback({error: "Error interno al obtener el idsolicitud en cuestion", details:error.message}, null);
      
    } else{
      console.log("Solicitud id obtenida con exito");
      callback(null, result)
    }
  })
}



module.exports = {
  registroUsuario,
  iniciarSesion,
  agregarServicio,
  obtenerDatosUsuarioPorCorreo,
  enviarSolicitud,
  obtenerDatosTrabajadorPorCorreo,
  obtenerServiciosSolicitadosPorTrabajador,
  aceptarSolicitud,
  obtenerRegiones,
  obtenerComunas,
  obtenerServicios,
  listarServicios,
  agregarReseña,
  obtenerTrabajadorIdPorCorreo,
  obtenerSolicitudIdPorTrabajadorId
};
