const db = require('./db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'jobbyjobcompany@gmail.com',
    pass: 'pgjy neox thrb cisl'
  }
});

function registroUsuario(usuario, callback) {
  const sql = `INSERT INTO usuario (correo_electronico, nombre, apellidos, telefono, fecha_creacion, fecha_nacimiento, contrasena, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const valores = [
    usuario.correo_electronico,
    usuario.nombre,
    usuario.apellidos,
    usuario.telefono,
    usuario.fecha_creacion,
    usuario.fecha_nacimiento,
    usuario.password,
    usuario.img // El arreglo de bytes de la imagen
  ];

  db.query(sql, valores, (err, resultado) => {
    if (err) {
      console.log("error al insertar a la base de datos: ", err);
      callback(err, null);
    } else {
      console.log("se ingresaron los valores con éxito: ", resultado);
      callback(null, resultado);
      let mailOptions = {
        from: 'tuCorreo@gmail.com',
        to: usuario.correo_electronico,
        subject: '¡Bienvenido a Jobby!',
        text: 'Gracias por registrarte, ' + usuario.nombre + '. ¡Esperamos que disfrutes nuestros servicios!'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error al enviar correo:', error);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });

    }
  });
}

function registroAdmin(userAdmin, callback) {
  const sql = `INSERT INTO user_admin (username, password) VALUES (?, ?)`;
  const valores = [
    userAdmin.username,
    userAdmin.password,

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

function loginAdmin(datosAdmin, callback) {
  const sql = `SELECT * FROM user_admin WHERE username = ?`;
  const valores = [datosAdmin.username];

  db.query(sql, valores, (err, resultados) => {
    if (err) {
      console.log("Error al consultar la base de datos: ", err);
      callback(err, null);
    } else {
      if (resultados.length === 0) {
        callback({ mensaje: "usuario o contraseña incorrectos" }, null);
      } else {
        const usuarioAdmin = resultados[0];


        if (datosAdmin.password === usuarioAdmin.password) {
          const token = jwt.sign({ usuarioId: usuarioAdmin.username }, 'tu_secreto', { expiresIn: '1h' }); //cambie el usuario id
          callback(null, { mensaje: "Inicio de sesión exitoso", token });
        } else {
          callback({ mensaje: "Contraseña incorrecta" }, null);
        }
      }
    }
  });
}




function iniciarSesion(datosUsuario, callback) {
  const sql = `SELECT * FROM usuario WHERE correo_electronico = ?`;
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
        const hash = crypto.createHash('sha256').update(datosUsuario.password).digest('hex');
        console.log(hash);
        if (hash == usuario.contrasena) {
          const token = jwt.sign({ usuarioId: usuario.correo_electronico }, 'tu_secreto', { expiresIn: '1h' }); //cambie el usuario id
          callback(null, { mensaje: "Inicio de sesión exitoso", token });
          let mailOptions = {
            from: 'tuCorreo@gmail.com',
            to: usuario.correo_electronico,
            subject: 'INICIASTE SESIÓN EN JOBBY',
            text: 'Sí no ingresaste sesión tu , te recomendamos cambiar tus datos'
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error al enviar correo:', error);
            } else {
              console.log('Correo enviado:', info.response);
            }
          });
        } else {
          callback({ mensaje: "Contraseña incorrecta" }, null);
        }
      }
    }
  });
}

function obtenerDatosUsuarioPorCorreo(correoElectronico, callback) {
  const sql = `SELECT correo_electronico,
  nombre,
  correo_electronico,
  TO_BASE64(UNHEX(img)) AS img_base64,
  apellidos,
  telefono,
  fecha_nacimiento,
  fecha_creacion
FROM usuario
WHERE correo_electronico = ?;`;

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

function modificarPerfil(correo_electronico, datosmod, callback) {
  // Validar el token del trabajador aquí (debe implementarse)

  // Actualizar el perfil en la base de datos
  db.query('UPDATE `usuario` SET `nombre`=?,`apellidos`=?,`telefono`=?,`img`=? WHERE correo_electronico=?',
    [datosmod.nombre, datosmod.apellidos, datosmod.telefono,  datosmod.img, datosmod.correo_electronico],
    (err, result) => {
      if (err) {
        console.error('Error al modificar el perfil:', err);
        callback({ error: 'Error interno al modificar el perfil', details: err.message }, null);
      } else {
        if (result.affectedRows === 0) {
          // Si no se encontró ningún registro para actualizar
          callback({ error: 'perfil no encontrado', details: 'No se encontró el perfil para modificar' }, null);
        } else {
          console.log('perfil modificado con éxito');
          callback(null, { message: 'perfil modificado con éxito' });
          let mailOptions = {
            from: 'tuCorreo@gmail.com',
            to: datosmod.correo_electronico,
            subject: '¡MODIFICASTE TUS DATOS EN JOBBY!',
            text: datosmod.nombre+' modificaste tus datos con exito'
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error al enviar correo:', error);
            } else {
              console.log('Correo enviado:', info.response);
            }
          });
        }
      }
    }
  );
}

function modificarPerfil1(correo_electronico, datosmod, callback) {
  // Validar el token del trabajador aquí (debe implementarse)

  // Actualizar el perfil en la base de datos
  db.query('UPDATE `usuario` SET `nombre`=?,`apellidos`=?,`telefono`=? WHERE correo_electronico=?',
    [datosmod.nombre, datosmod.apellidos, datosmod.telefono, datosmod.correo_electronico],
    (err, result) => {
      if (err) {
        console.error('Error al modificar el perfil:', err);
        callback({ error: 'Error interno al modificar el perfil', details: err.message }, null);
      } else {
        if (result.affectedRows === 0) {
          // Si no se encontró ningún registro para actualizar
          callback({ error: 'perfil no encontrado', details: 'No se encontró el perfil para modificar' }, null);
        } else {
          
          console.log('perfil modificado con éxito');
          callback(null, { message: 'perfil modificado con éxito' });
          let mailOptions = {
            from: 'tuCorreo@gmail.com',
            to: datosmod.correo_electronico,
            subject: '¡MODIFICASTE EL TUS DATOS!',
            text: datosmod.nombre+' modificaste tus datos con exito'
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error al enviar correo:', error);
            } else {
              console.log('Correo enviado:', info.response);
            }
          });
        }
      }
    }
  );
}


function modificarServicio(id_des_serv, serviceData, callback) {
  // Validar el token del trabajador aquí (debe implementarse)

  // Actualizar el servicio en la base de datos
  db.query('UPDATE `descrip_servicio` SET `id_des_serv`=?,`des_serv`=?,`img_portada`=?,`presencial`=?,`id_trabajador`=?,`id_serv`=?,`id_comuna`=?,`id_region`=? WHERE id_des_serv=?',
    [serviceData.id_des_serv, serviceData.des_serv, serviceData.img_portada,  serviceData.presencial, serviceData.id_trabajador, serviceData.id_serv, serviceData.id_comuna, serviceData.id_region, id_des_serv],
    (err, result) => {
      if (err) {
        console.error('Error al modificar el servicio:', err);
        callback({ error: 'Error interno al modificar el servicio', details: err.message }, null);
      } else {
        if (result.affectedRows === 0) {
          // Si no se encontró ningún registro para actualizar
          callback({ error: 'Servicio no encontrado', details: 'No se encontró el servicio para modificar' }, null);
        } else {
          console.log('Servicio modificado con éxito');
          callback(null, { message: 'Servicio modificado con éxito' });
        }
      }
    }
  );
}

function modificarServicio2(id_des_serv, serviceData, callback) {
  // Validar el token del trabajador aquí (debe implementarse)

  // Actualizar el servicio en la base de datos
  db.query('UPDATE `descrip_servicio` SET `id_des_serv`=?,`des_serv`=?,`presencial`=?,`id_trabajador`=?,`id_serv`=?,`id_comuna`=?,`id_region`=? WHERE id_des_serv=?',
    [serviceData.id_des_serv, serviceData.des_serv,  serviceData.presencial, serviceData.id_trabajador, serviceData.id_serv, serviceData.id_comuna, serviceData.id_region, id_des_serv],
    (err, result) => {
      if (err) {
        console.error('Error al modificar el servicio:', err);
        callback({ error: 'Error interno al modificar el servicio', details: err.message }, null);
      } else {
        if (result.affectedRows === 0) {
          // Si no se encontró ningún registro para actualizar
          callback({ error: 'Servicio no encontrado', details: 'No se encontró el servicio para modificar' }, null);
        } else {
          console.log('Servicio modificado con éxito');
          callback(null, { message: 'Servicio modificado con éxito' });
        }
      }
    }
  );
}


// Eliminar servicio por id de servicio
function eliminarServicio(id_des_serv, callback) {
  // Eliminar registros de la tabla reseña relacionados con id_solicitud
  db.query(
    'DELETE FROM reseña WHERE id_solicitud IN (SELECT id_solicitud FROM solicitud WHERE id_des_serv = ?)',
    [id_des_serv],
    (err, result) => {
      if (err) {
        console.error('Error al eliminar registros de reseña:', err);
        callback({ error: 'Error interno al eliminar registros de reseña', details: err.message }, null);
      } else {
        // Ahora que los registros en reseña se han eliminado, procedemos a eliminar registros en solicitud
        db.query(
          'DELETE FROM solicitud WHERE id_des_serv = ?',
          [id_des_serv],
          (err, result) => {
            if (err) {
              console.error('Error al eliminar registros de solicitud:', err);
              callback({ error: 'Error interno al eliminar registros de solicitud', details: err.message }, null);
            } else {
              // Ahora que los registros en solicitud se han eliminado, procedemos a eliminar registros en descrip_servicio
              db.query(
                'DELETE FROM descrip_servicio WHERE id_des_serv = ?',
                [id_des_serv],
                (err, result) => {
                  if (err) {
                    console.error('Error al eliminar registros de descrip_servicio:', err);
                    callback({ error: 'Error interno al eliminar registros de descrip_servicio', details: err.message }, null);
                  } else {
                    if (result.affectedRows === 0) {
                      // Si no se encontró ningún registro para eliminar en descrip_servicio
                      callback({ error: 'Servicio no encontrado', details: 'No se encontró el servicio para eliminar en descrip_servicio' }, null);
                    } else {
                      console.log('Servicio eliminado con éxito en todas las tablas relacionadas');
                      callback(null, { message: 'Servicio eliminado con éxito en todas las tablas relacionadas' });
                    }
                  }
                });
            }
          });
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
      let mailOptions = {
        from: 'tuCorreo@gmail.com',
        to:  solicitudData.correo_electronico,
        subject: '¡Bienvenido a Jobby!',
        text: 'Enviaste una solicitud de , ' + solicitudData.titulo_solicitud + 'con la descripción ' +  solicitudData.des_solicitud
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error al enviar correo:', error);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });
    }
  });
}

function obtenerDatosTrabajadorPorCorreo(correoElectronico, callback) {
  // Consulta para los datos de servicio
  const sqlServicio = `
    SELECT trabajador.id_trabajador,
    descrip_servicio.id_des_serv,
    servicio.name_serv,
    descrip_servicio.des_serv,
    usuario.correo_electronico,
    TO_BASE64(UNHEX(img_portada)) AS img_portada_base64,
    comuna.name_comuna,
    region.name_region,
    trabajador.disponibilidad
    FROM trabajador
    JOIN descrip_servicio ON descrip_servicio.id_trabajador = trabajador.id_trabajador
    JOIN servicio ON servicio.id_serv = descrip_servicio.id_serv
    JOIN usuario ON usuario.correo_electronico = trabajador.correo_electronico  
    JOIN comuna ON descrip_servicio.id_comuna = comuna.id_comuna  
    JOIN region ON region.id_region=descrip_servicio.id_region
    WHERE trabajador.correo_electronico = ?
  `;

  // Consulta para los datos del trabajador
  const sqlTrabajador = `
    SELECT trabajador.id_trabajador,
    usuario.correo_electronico,
    usuario.nombre,
    usuario.apellidos,
    TO_BASE64(UNHEX(img)) AS img_base64,
    usuario.telefono,
    usuario.fecha_nacimiento,
    trabajador.des_perfil
    FROM trabajador
    JOIN usuario ON usuario.correo_electronico = trabajador.correo_electronico
    WHERE trabajador.correo_electronico = ?
  `;

  // Consulta para los datos de la galería
  const sqlGaleria = `
    SELECT
    id_foto,
    TO_BASE64(UNHEX(foto)) AS img_galeria_base64,
    descripcion
    FROM foto_servicio
    JOIN trabajador ON trabajador.id_trabajador = foto_servicio.id_trabajador
    WHERE trabajador.correo_electronico = ?
  `;

  // Consulta para los datos de documentos
  const sqlDocumentos = `
    SELECT 
    titulo,
    id_documento,
TO_BASE64(UNHEX(documento)) AS documento_hex,
    t.id_trabajador,
    t.correo_electronico
    FROM documento_trabajador
    JOIN trabajador t ON t.id_trabajador = documento_trabajador.id_trabajador  
    WHERE t.correo_electronico = ?
  `;

  const valores = [correoElectronico];

  db.query(sqlServicio, valores, (errServicio, datosServicio) => {
    if (errServicio) {
      console.error('Error al obtener los datos de servicio:', errServicio);
      callback({ error: 'Error interno al obtener los datos de servicio', details: errServicio.message }, null);
    } else {
      // Después de obtener los datos de servicio, realizamos la consulta para los datos del trabajador
      db.query(sqlTrabajador, valores, (errTrabajador, datosTrabajador) => {
        if (errTrabajador) {
          console.error('Error al obtener los datos del trabajador:', errTrabajador);
          callback({ error: 'Error interno al obtener los datos del trabajador', details: errTrabajador.message }, null);
        } else {
          // Después de obtener los datos del trabajador, realizamos la consulta para los datos de la galería
          db.query(sqlGaleria, valores, (errGaleria, datosGaleria) => {
            if (errGaleria) {
              console.error('Error al obtener los datos de la galería:', errGaleria);
              callback({ error: 'Error interno al obtener los datos de la galería', details: errGaleria.message }, null);
            } else {
              // Después de obtener los datos de la galería, realizamos la consulta para los datos de documentos
              db.query(sqlDocumentos, valores, (errDocumentos, datosDocumentos) => {
                if (errDocumentos) {
                  console.error('Error al obtener los datos de documentos:', errDocumentos);
                  callback({ error: 'Error interno al obtener los datos de documentos', details: errDocumentos.message }, null);
                } else {
                  console.log('Datos de servicio, trabajador, galería y documentos obtenidos con éxito');
                  // Aquí puedes combinar los datos como desees
                  const resultadoFinal = {
                    datosServicio: datosServicio,
                    datosTrabajador: datosTrabajador,
                    datosGaleria: datosGaleria,
                    datosDocumentos: datosDocumentos
                  };
                  callback(null, resultadoFinal);
                }
              });
            }
          });
        }
      });
    }
  });
}



function agregarServicio(serviceData, callback) {

  const query = 'INSERT INTO descrip_servicio (des_serv, presencial, id_trabajador, id_serv, id_comuna, id_region, img_portada) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const valores = [
    serviceData.des_serv,
    serviceData.presencial,
    serviceData.id_trabajador,
    serviceData.id_serv,
    serviceData.id_comuna,
    serviceData.id_region,
    serviceData.img_portada
  ];

  db.query(query, valores, (err, result) => {
    if (err) {
      console.error('Error al agregar el servicio:', err);
      callback({ error: 'Error interno al agregar el servicio', details: err.message }, null);
    } else {
      console.log('Servicio agregado con éxito');
      callback(null, { message: 'Servicio agregado con éxito' }, result);
    }

  })

};



//Funcion Agregar imagen a Galeria
function agregarGaleria(galleryData, callback) {

  const query = 'INSERT INTO `foto_servicio`(`foto`, `id_trabajador`, `descripcion`) VALUES ( ?, ?, ?)';
  const valores = [
    galleryData.foto,
    galleryData.id_trabajador,
    galleryData.descripcion
  ];

  db.query(query, valores, (err, result) => {
    if (err) {
      console.error('Error al agregar a galeria:', err);
      callback({ error: 'Error interno al agregar a galeria', details: err.message }, null);
    } else {
      console.log('Foto agregada con éxito a galeria');
      callback(null, { message: 'Foto agregada con éxito a galeria' }, result);
    }

  })

};


function eliminarGaleria(id_foto, callback) {
  const sqlEliminarGaleria = 'DELETE FROM foto_servicio WHERE id_foto = ?';
  const valores = [id_foto];

  db.query(sqlEliminarGaleria, valores, (err, resultado) => {
    if (err) {
      console.error('Error al eliminar la galería:', err);
      callback({ error: 'Error interno al eliminar la galería', details: err.message });
    } else {
      console.log('Galería eliminada con éxito');
      callback(null, { mensaje: 'Galería eliminada con éxito' });
    }
  });
}

//Fin de funcion Agregar imagen a Galeria


//Eliminar documento x id
function eliminarDocumento(id_documento, callback) {
  const sqlEliminarDocumento = 'DELETE FROM documento_trabajador WHERE id_documento = ?';
  const valores = [id_documento];

  db.query(sqlEliminarDocumento, valores, (err, resultado) => {
    if (err) {
      console.error('Error al eliminar el documento:', err);
      callback({ error: 'Error interno al eliminar el documento', details: err.message });
    } else {
      console.log('Documento eliminado  con éxito');
      callback(null, { mensaje: 'Documento eliminado con éxito' });
    }
  });
}

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


function obtenerServiciosSolicitadosPorCliente(correoElectronico, callback) {
  const sql = `
  SELECT 
  id_solicitud,
  trabajador.id_trabajador,
  usuario.nombre,
  usuario.apellidos,
  solicitud.id_des_serv,
  solicitud.correo_electronico as 'correo_solicitante',
  titulo_solicitud,
  estado,
  fecha_solicitud,
  des_solicitud,
  servicio.name_serv,
  descrip_servicio.des_serv,
  usuario.correo_electronico as 'correo_trabajador',
  comuna.name_comuna,
  region.name_region,
  usuario.telefono
  FROM solicitud
  JOIN trabajador ON trabajador.id_trabajador = solicitud.id_trabajador
  JOIN usuario ON usuario.correo_electronico = trabajador.correo_electronico
  JOIN descrip_servicio ON descrip_servicio.id_des_serv = solicitud.id_des_serv
  JOIN servicio ON servicio.id_serv = descrip_servicio.id_serv
  JOIN comuna ON descrip_servicio.id_comuna = comuna.id_comuna  
  JOIN region ON region.id_region=descrip_servicio.id_region
    WHERE solicitud.correo_electronico = ?
  `;

  const valores = [correoElectronico];

  db.query(sql, valores, (err, resultados) => {
    if (err) {
      console.error('Error al obtener los servicios solicitados por cliente:', err);
      callback({ error: 'Error interno al obtener los servicios solicitados por cliente', details: err.message }, null);
    } else {
      console.log('Servicios solicitados por cliente obtenidos con éxito');
      callback(null, resultados);
    }
  });
}



function servEspecifico(id_des_serv, callback) {
  const query = `
  SELECT 	ds.des_serv,
		ds.id_des_serv,
        ds.presencial,
        ds.id_trabajador,
        ds.id_serv,
        ds.id_region,
        ds.id_comuna,
        ds.presencial,
        t.correo_electronico,
        t.disponibilidad,
        name_serv,
        name_comuna,
        name_region,
        img_portada AS img_portada_real_2,
        UNHEX(img_portada) AS img_portada_real,
        TO_BASE64(UNHEX(COALESCE(img_portada, ''))) AS img_portada
        
  FROM descrip_servicio ds JOIN trabajador t ON(ds.id_trabajador = t.id_trabajador) 
  JOIN servicio s ON(ds.id_serv = s.id_serv) 
  JOIN region r ON(ds.id_region = r.id_region)
  JOIN  comuna c ON (ds.id_comuna = c.id_comuna) WHERE id_des_serv = ?`;

  const valores = [id_des_serv];
  db.query(query, valores, (error, result) => {
    if (error) {
      console.log("Error al obtener listado de servicios", error);
      callback(error, null);
      return;
    } else {
      callback(null, result)
    }
  })
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
  db.query(query, (error, result) => {
    if (error) {
      console.log("Error al obtener regiones", error);
      callback(error, null)
      return;

    } else {
      callback(null, result)
    }

  });

}

function obtenerComunas(callback) {
  const query = 'SELECT * FROM comuna';
  db.query(query, (error, result) => {
    if (error) {
      console.log("Error al obtener Comunas", error);
      callback(error, null)
      return;

    } else {
      callback(null, result)
    }

  });

}

function obtenerServicios(callback) {
  const query = 'SELECT * FROM servicio';
  db.query(query, (error, result) => {
    if (error) {
      console.log("Error al obtener servicios", error);
      callback(error, null);
      return;

    } else {
      callback(null, result)
    }
  })

}

function listarServicios(callback) {
  const query = `SELECT ds.des_serv, ds.presencial, TO_BASE64(UNHEX(img_portada)) AS img_portada_base64, t.correo_electronico, t.disponibilidad, name_serv, name_comuna, name_region 
  FROM descrip_servicio ds JOIN trabajador t ON(ds.id_trabajador = t.id_trabajador) 
  JOIN servicio s ON(ds.id_serv = s.id_serv) 
  JOIN region r ON(ds.id_region = r.id_region)
  JOIN  comuna c ON (ds.id_comuna = c.id_comuna)`;
  db.query(query, (error, result) => {
    if (error) {
      console.log("Error al obtener listado de servicios", error);
      callback(error, null);
      return;
    } else {
      callback(null, result)
    }
  })
}


function agregarReseña(reseñaData, callback) {
  const query = `INSERT INTO reseña (descripcion, calificacion, id_solicitud) VALUES (?, ?, ?)`;
  const valores = [reseñaData.descripcion, reseñaData.calificacion, reseñaData.id_solicitud];

  db.query(query, valores, (error, result) => {
    if (error) {
      console.log('Error al agregar reseña', error);
      callback(error, null);
    } else {
      console.log('Éxito al agregar reseña', result);
      callback(null, result);
    }
  });
}


function listarReseñaPorTrabajador(trabajadorId, callback) {
  const query = `SELECT r.descripcion, r.calificacion from reseña r 
  JOIN solicitud s ON (r.id_solicitud = s.id_solicitud)
  JOIN trabajador t ON (s.id_trabajador = t.id_trabajador)
  WHERE s.id_trabajador = ?`;

  const valores = [trabajadorId];
  db.query(query, valores, (error, result) => {
    if (error) {
      console.log("Error al obtener el listado de reseñas por trabajador");
      callback(error, null);

    } else {
      console.log("éxito al obtener el listado de reseñas por trabajador");
      callback(null, result);
    }
  });
}


function listarReseña(correoElectronicoo, solicitudId, callback) {
  const query = `SELECT id_reseña AS id_resena, descripcion, calificacion,r.estado,r.id_solicitud, t.correo_electronico
  from reseña r 
  JOIN solicitud s ON (r.id_solicitud = s.id_solicitud)
  JOIN trabajador t ON (s.id_trabajador = t.id_trabajador)
  WHERE t.correo_electronico = ? AND s.id_solicitud = ?`;
  const valores = [correoElectronicoo, solicitudId];
  db.query(query, valores, (error, result) => {
    if (error) {
      console.log("Error al obtener la reseña");
      callback(error, null);

    } else {
      console.log("Reseña obtenida exitosamente");
      callback(null, result);
    }
  });
}
function getReseñasAdmin(callback) {
  const query = `SELECT id_reseña as id_resena, descripcion, calificacion, estado, created_at, updated_at
  FROM reseña WHERE estado = 'reportado'`;
  db.query(query, (error, result) => {
    if (error) {
      console.log("Error al obtener las resenas reportadas");
      callback(error, null)
    } else {
      console.log("reseñas reportadas obtenidas con exito");
      callback(null, result);
    }
  });
}


function obtenerResenas(correoElectronico, callback) {
  const query = `SELECT r.id_reseña AS id_resena, r.descripcion, r.calificacion,r.estado, r.id_solicitud
  from reseña r JOIN solicitud s ON (r.id_solicitud = s.id_solicitud) 
  JOIN trabajador t ON (s.id_trabajador = t.id_trabajador)
  WHERE t.correo_electronico = ?`;
  const valores = [correoElectronico]

  db.query(query, valores, (error, result) => {
    if (error) {
      console.log("Error al obtener las reseñas");
      callback(error, null);

    } else {
      console.log("Reseñas obtenidas correctamente");
      callback(null, result)
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

const registrarTrabajador = (disponibilidad, des_perfil, correo_electronico, callback) => {
  const query = `INSERT INTO trabajador (disponibilidad, des_perfil, correo_electronico) VALUES (?, ?, ?)`;

  db.query(query, [disponibilidad, des_perfil, correo_electronico], (error, result) => {
    if (error) {
      console.error('Error al registrar el trabajador:', error);
      return callback(error, null);
    }
    callback(null, result);
    let mailOptions = {
      from: 'tuCorreo@gmail.com',
      to: correo_electronico,
      subject: '¡Bienvenido trabajador a Jobby!',
      text: 'Gracias por registrarte como trabajador, ' + '. ¡Esperamos que disfrutes al promocionar tus servicios.!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar correo:', error);
      } else {
        console.log('Correo enviado:', info.response);
      }
    });
  });
};


function obtenerSolicitudIdPorTrabajadorId(trabajadorId, callback) {
  const query = `SELECT id_solicitud, estado FROM solicitud
  WHERE id_trabajador = ? AND estado = 'Finalizado'`;
  const valores = [trabajadorId];
  db.query(query, valores, (error, result) => {
    if (error) {
      console.log("Error al obtener el idsolicitud en cuestion", error);
      callback({ error: "Error interno al obtener el idsolicitud en cuestion", details: error.message }, null);

    } else {
      console.log("Solicitud id obtenida con exito");
      callback(null, result)
    }
  })
}

function agregarFavorito(req, res) {
  const { id_usuario, id_trabajador } = req.body;
  const sql = `INSERT INTO favorito (favorito, id_usuario, id_trabajador) VALUES (1, ?, ?)`;
  db.query(sql, [id_usuario, id_trabajador], (error, result) => {
    if (error) {
      console.error('Error al agregar como favorito:', error);
      return res.status(500).json({ error: 'Error interno al agregar como favorito' });
    }

    console.log('Trabajador agregado como favorito con éxito');
    res.status(200).json({ message: 'Trabajador agregado como favorito con éxito' });
  });
}
function quitarFavorito(req, res) {
  const { id_usuario, id_trabajador } = req.body;
  const sql = `DELETE FROM favorito WHERE id_usuario = ? AND id_trabajador = ?`;
  db.query(sql, [id_usuario, id_trabajador], (error, result) => {
    if (error) {
      console.error('Error al quitar como favorito:', error);
      return res.status(500).json({ error: 'Error interno al quitar como favorito' });
    }

    console.log('Trabajador quitado de favoritos con éxito');
    res.status(200).json({ message: 'Trabajador quitado de favoritos con éxito' });
  });
}
function verificarFavorito(req, res) {
  const { id_usuario, id_trabajador } = req.body;
  const sql = `SELECT COUNT(*) AS esFavorito FROM favorito WHERE id_usuario = ? AND id_trabajador = ?`;
  db.query(sql, [id_usuario, id_trabajador], (error, result) => {
    if (error) {
      console.error('Error al verificar si el trabajador es un favorito:', error);
      return res.status(500).json({ error: 'Error interno al verificar el favorito' });
    }

    const esFavorito = result[0].esFavorito === 1;

    res.status(200).json({ esFavorito });
  });
}

function listarFavoritos(req, res) {
  const { id_usuario } = req.body;
  const sql = `
    SELECT favorito.id_usuario,
           trabajador.correo_electronico,
           trabajador.disponibilidad,
           usuario.nombre,
           TO_BASE64(UNHEX(usuario.img)) AS img_base64,
           usuario.apellidos,
           trabajador.des_perfil
    FROM favorito
    JOIN trabajador ON favorito.id_trabajador = trabajador.id_trabajador
    JOIN usuario ON usuario.correo_electronico = trabajador.correo_electronico
    WHERE favorito.id_usuario = ?;
  `;

  db.query(sql, [id_usuario], (error, result) => {
    if (error) {
      console.error('Error al listar los trabajadores favoritos:', error);
      return res.status(500).json({ error: 'Error interno al listar favoritos' });
    }

    res.status(200).json({ favoritos: result });
  });
}




function agregarDocumentacionTrabajador(documentData, callback) {
  const query = `INSERT INTO documento_trabajador(titulo, documento, id_trabajador) VALUES(?,?,?)`;
  const valores = [
    documentData.titulo,
    documentData.documento,
    documentData.id_trabajador
  ];

  db.query(query, valores, (error, result) => {
    if (error) {
      console.log("Error al insertar documentacion", error);
      callback({ error: "Error al insertar la documentacion", details: error.message }, null);

    } else {
      console.log("Documentacion agregada con exito");
      callback(null, result)
    }
  });

}


function calcularPromedioCalificacionTrabajador(correoElectronico, callback) {
  const query = `SELECT 
  (SUM(reseña.calificacion)/COUNT(reseña.id_reseña))AS promedio_calificacion
  FROM trabajador
  JOIN usuario ON usuario.correo_electronico = trabajador.correo_electronico
  JOIN solicitud ON trabajador.id_trabajador = solicitud.id_trabajador
  JOIN reseña ON solicitud.id_solicitud = reseña.id_solicitud
  WHERE trabajador.correo_electronico = ?
  GROUP BY trabajador.id_trabajador`;

  const valores = [correoElectronico];

  db.query(query, valores, (error, result) => {
    if (error) {
      console.log("Error al obtener promedio calificaciones por trabajador");
      callback({ error: "Error interno al obtener el promedio de calificaciones por trabajador", details: error.message }, null)

    } else {
      console.log("Promedio de calificaciones por trabajador obtenido con éxito");
      callback(null, result)
    }
  })
}



function calcularPromedioCalificacionServicio(idServicio, trabajadorId, callback) {
  const query = `SELECT (SUM(r.calificacion)/COUNT(r.id_reseña))AS promedio_servicio, s.id_trabajador 
  FROM reseña r 
  JOIN solicitud s ON(r.id_solicitud = s.id_solicitud) 
  JOIN descrip_servicio ds ON (s.id_des_serv = ds.id_des_serv)

  WHERE s.id_des_serv = ? AND s.id_trabajador = ?`;
  const valores = [idServicio, trabajadorId];

  db.query(query, valores, (err, result) => {
    if (err) {
      console.error('Error al obtener el promedio de calificaciones por servicio:', err);
      callback({ error: 'Error interno al obtener el promedio de calificaciones por servicio', details: err.message }, null);
    } else {
      console.log('Promedio de calificaciones por servicio obtenido con éxito');
      callback(null, result);
    }
  });


}

function actualizarDisponibilidad(correo_electronico, disponibilidad, callback) {
  const sql = 'UPDATE trabajador SET disponibilidad = ? WHERE correo_electronico = ?';

  db.query(sql, [disponibilidad, correo_electronico], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta SQL:', error);
      callback(error, null);
    } else {
      console.log('Actualización exitosa:', results);
      callback(null, results);
      let mailOptions = {
        from: 'tuCorreo@gmail.com',
        to: correo_electronico,
        subject: '¡Cambiaste tu estado de trabajador en jobby!',
        text: 'Cambiaste recientemente tu estado de disponibilidad en jobby a '+ disponibilidad
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error al enviar correo:', error);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });
    }
  });
}

function agregarVisitaConSolicitud(visitaData, callback) {
  const query = `INSERT INTO agenda(titulo, descripcion, fecha, hora, id_solicitud) VALUES(?,?,?,?,?)`;
  const valores = [
    visitaData.titulo,
    visitaData.descripcion,
    visitaData.fecha,
    visitaData.hora,
    visitaData.id_solicitud
  ];

  db.query(query, valores, (error, result) => {
    if (error) {
      console.log("Error al insertar visita", error);
      callback({ error: "Error al insertar la visita", details: error.message }, null);
    } else {
      console.log("Visita agregada con éxito con ID de solicitud");
      callback(null, result);
    }
  });
}

function visitasAgendadas(correoTrabajador, callback) {
  const query = `
      SELECT 
          trabajador.correo_electronico as correo_trabajador,
          usuario.correo_electronico AS correo_usuario,
          agenda.titulo,
          agenda.descripcion,
          agenda.fecha,
          agenda.hora,
          servicio.name_serv,
          solicitud.des_solicitud
      FROM solicitud
      JOIN trabajador ON solicitud.id_trabajador = trabajador.id_trabajador
      JOIN usuario ON usuario.correo_electronico = solicitud.correo_electronico
      JOIN agenda ON solicitud.id_solicitud = agenda.id_agenda
      JOIN descrip_servicio ON solicitud.id_des_serv = descrip_servicio.id_des_serv
      JOIN servicio ON descrip_servicio.id_serv = servicio.id_serv 
      WHERE trabajador.correo_electronico = ?`;

  db.query(query, [correoTrabajador], (err, result) => {
    if (err) {
      console.error('Error al obtener las visitas agendadas:', err);
      callback({ error: 'Error interno al obtener las visitas agendadas', details: err.message }, null);
    } else {
      console.log('Visitas agendadas obtenidas con éxito');
      callback(null, result);
    }
  });
}

function horasAgendadasParaCliente(correoCliente, callback) {
  const query = `
      SELECT 
          trabajador.correo_electronico as correo_trabajador,
          usuario.correo_electronico AS correo_usuario,
          agenda.titulo,
          agenda.descripcion,
          agenda.fecha,
          agenda.hora,
          servicio.name_serv,
          solicitud.des_solicitud
      FROM solicitud
      JOIN trabajador ON solicitud.id_trabajador = trabajador.id_trabajador
      JOIN usuario ON usuario.correo_electronico = solicitud.correo_electronico
      JOIN agenda ON solicitud.id_solicitud = agenda.id_agenda
      JOIN descrip_servicio ON solicitud.id_des_serv = descrip_servicio.id_des_serv
      JOIN servicio ON descrip_servicio.id_serv = servicio.id_serv 
      WHERE usuario.correo_electronico = ?`;

  db.query(query, [correoCliente], (err, result) => {
    if (err) {
      console.error('Error al obtener las visitas agendadas:', err);
      callback({ error: 'Error interno al obtener las visitas agendadas', details: err.message }, null);
    } else {
      console.log('Visitas agendadas obtenidas con éxito');
      callback(null, result);
    }
  });
}






function emitirReporteResena(resenaId, nuevoEstado, callback) {
  const sql = `UPDATE reseña SET estado = ? WHERE id_reseña = ?`;

  db.query(sql, [nuevoEstado, resenaId], (error, result) => {
    if (error) {
      console.log("Error al actualizar el estado de la resena");
      callback(error, null);
    } else {
      console.log("Estado de resena actualizado con exito", resenaId, nuevoEstado);
      callback(null, result);
    }
  });
}
function obtenerResenaEspecifica(resenaId, callback) {
  const sql = 'SELECT id_reseña as id_resena, descripcion, calificacion, estado, id_solicitud, created_at, updated_at FROM reseña WHERE id_reseña = ?';
  db.query(sql, [resenaId], (error, result) => {
    if (error) {
      console.log("Error al obtener la reseña especifica");
      callback(error, null);
    } else {
      console.log("Reseña espeficifa obtenida con exito");
      callback(null, result)
    }
  });
}

function modificarResena(resenaId, resenaData, callback) {
  db.query('UPDATE reseña SET id_reseña = ?, descripcion = ?,  estado = ?, id_solicitud = ? WHERE id_reseña = ?',
    [resenaData.id_reseña, resenaData.descripcion,resenaData.estado, resenaData.id_solicitud, resenaId],
    (err, result) => {
      if (err) {
        console.error('Error al modificar la reseña:', err);
        callback({ error: 'Error interno al modificar la reseña', details: err.message }, null);
      } else {
        if (result.affectedRows === 0) {
          // Si no se encontró ningún registro para actualizar
          callback({ error: 'Reseña no encontrada', details: 'No se encontró la reseña para modificar' }, null);
        } else {
          console.log('Reseña modificada con éxito');
          callback(null, { message: 'Reseña modificada con éxito' });
        }
      }
    }
  );





}


module.exports = {
  registroUsuario,
  iniciarSesion,
  agregarServicio,
  agregarGaleria,
  modificarPerfil,
  modificarPerfil1,
  modificarServicio,
  modificarServicio2,
  obtenerDatosUsuarioPorCorreo,
  enviarSolicitud,
  obtenerDatosTrabajadorPorCorreo,
  obtenerServiciosSolicitadosPorTrabajador,
  obtenerServiciosSolicitadosPorCliente,
  aceptarSolicitud,
  obtenerRegiones,
  obtenerComunas,
  obtenerServicios,
  listarServicios,
  servEspecifico,
  agregarReseña,
  obtenerTrabajadorIdPorCorreo,
  obtenerSolicitudIdPorTrabajadorId,
  registrarTrabajador,
  agregarDocumentacionTrabajador,
  eliminarServicio,
  agregarFavorito,
  quitarFavorito,
  verificarFavorito,
  listarFavoritos,
  calcularPromedioCalificacionServicio,
  calcularPromedioCalificacionTrabajador,
  eliminarGaleria,
  actualizarDisponibilidad,
  listarReseñaPorTrabajador,
  listarReseña,
  obtenerResenas,
  registroAdmin,
  loginAdmin,
  emitirReporteResena,
  getReseñasAdmin,
  modificarResena,
  agregarVisitaConSolicitud,
  visitasAgendadas,
  horasAgendadasParaCliente,
  obtenerResenaEspecifica,
  eliminarDocumento,

};
