const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { loginAdmin,visitasAgendadas, horasAgendadasParaCliente,eliminarDocumento, eliminarGaleria,agregarGaleria, agregarVisitaConSolicitud, actualizarDisponibilidad, listarFavoritos, verificarFavorito, eliminarServicio, agregarFavorito, quitarFavorito, registroUsuario, iniciarSesion, obtenerDatosUsuarioPorCorreo, agregarServicio, enviarSolicitud, servEspecifico, modificarServicio, obtenerDatosTrabajadorPorCorreo, obtenerServiciosSolicitadosPorTrabajador, obtenerServiciosSolicitadosPorCliente, aceptarSolicitud, obtenerRegiones, obtenerComunas, obtenerServicios, listarServicios, agregarReseña, obtenerTrabajadorIdPorCorreo, obtenerSolicitudIdPorTrabajadorId, registrarTrabajador, agregarDocumentacionTrabajador, calcularPromedioCalificacionServicio, calcularPromedioCalificacionTrabajador,listarReseñaPorTrabajador, listarReseña, obtenerResenas,getReseñasAdmin, obtenerResenaEspecifica,modificarResena,emitirReporteResena } = require('./controller');
const { ifError } = require('assert');
const controller = require('./controller.js');
const jwt = require('jsonwebtoken');



// Configura un límite de carga más grande (por ejemplo, 50 MB)


const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


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

//registro admin
app.post('/registro-admin', (req, res) => {
  const datosAdmin = req.body;

  registroAdmin(datosAdmin, (error, resultado) => {
    if (error) {
      console.log("error json registro", error);
      res.status(500).json({ error: 'error al registar usuario', error });
    } else {
      console.log("exito al ingresar los datos");
      res.status(201).json({ mensaje: "Usuario registrado con exito" });
    }
  });
});


app.post('/login-admin', (req, res) => {
  const datosAdmin = req.body;

  loginAdmin(datosAdmin, (error, resultado) => {
    if (error) {
      console.log("Error en el inicio de sesión: ", error);
      res.status(401).json(error);
    } else {
      console.log("Inicio de sesión exitoso");
      res.status(200).json(resultado);
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



app.post('/agregar_servicio', (req, res) => {
  const serviceData = req.body;
  agregarServicio(serviceData, (error, resultado) => {
    if (error) {
      console.error('Error al agregar el servicio:', error);
      res.status(500).json(error);
    } else {
      console.log('Servicio agregado con éxito');
      res.status(200).json(resultado);
    }
  });
});

app.post('/agregar_a_galeria', (req, res) => {
  const galleryeData = req.body;
  agregarGaleria(galleryeData, (error, resultado) => {
    if (error) {
      console.error('Error al agregar foto en galeria:', error);
      res.status(500).json(error);
    } else {
      console.log('Foto agregada con éxito a la galeria');
      res.status(200).json(resultado);
    }
  });
});

//Eliminar Galeria
app.delete('/eliminar_galeria/:id_foto', (req, res) => {
  const id_foto = req.params.id_foto;

  // Llamar a la función eliminarGaleria con el id_foto 
  eliminarGaleria(id_foto, (error, resultado) => {
    if (error) {
      console.error('Error al eliminar foto de galeria:', error);
      res.status(500).json(error);
    } else {
      console.log('Foto eliminado con éxito');
      res.status(200).json(resultado);
    }
  });
});


//Eliminar Documento
app.delete('/eliminar_documento/:id_documento', (req, res) => {
  const id_documento = req.params.id_documento;

  // Llamar a la función eliminarDocumento con el id_documento 
  eliminarDocumento(id_documento, (error, resultado) => {
    if (error) {
      console.error('Error al eliminar documento:', error);
      res.status(500).json(error);
    } else {
      console.log('Documento eliminado con éxito');
      res.status(200).json(resultado);
    }
  });
});



app.put('/modificar_servicio/:id_des_serv', (req, res) => {
  const id_des_serv = req.params.id_des_serv;
  const serviceData = req.body;

  // Llamar a la función modificarServicio con el id_des_serv y los nuevos datos
  modificarServicio(id_des_serv, serviceData, (error, resultado) => {
    if (error) {
      console.error('Error al modificar el servicio:', error);
      res.status(500).json(error);
    } else {
      console.log('Servicio modificado con éxito');
      res.status(200).json(resultado);
    }
  });
});

//Eliminar Servicio
app.delete('/eliminar_servicio/:id_des_serv', (req, res) => {
  const id_des_serv = req.params.id_des_serv;

  // Llamar a la función eliminarServicio con el id_des_serv y los nuevos datos
  eliminarServicio(id_des_serv, (error, resultado) => {
    if (error) {
      console.error('Error al eliminar el servicio:', error);
      res.status(500).json(error);
    } else {
      console.log('Servicio eliminado con éxito');
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


app.post('/enviar-solicitud/:correoDestinatario', (req, res) => {
  const correoDestinatario = req.params.correoDestinatario;
  const solicitudData = req.body;
  enviarSolicitud(solicitudData, (error, resultado) => {
    if (error) {
      console.log("Error al enviar la solicitud:", error);
      res.status(500).json({ error: 'Error al enviar la solicitud', details: error });
    } else {
      console.log("Solicitud enviada con éxito");
      res.status(200).json(resultado);
    }
  });
});

app.get('/obtener-datos-trabajador/:correo', (req, res) => {
  const correoElectronico = req.params.correo;

  obtenerDatosTrabajadorPorCorreo(correoElectronico, (error, resultadoFinal) => {
    if (error) {
      console.log("Error al obtener los datos del trabajador: ", error);
      res.status(404).json(error);
    } else {
      console.log("Datos del trabajador obtenidos con éxito: ", resultadoFinal);
      res.status(200).json(resultadoFinal);
    }
  });
});


app.get('/servicio-especifico/:id_des_serv', (req, res) => {
  const id_des_serv = req.params.id_des_serv;

  servEspecifico(id_des_serv, (error, result) => {
    if (error) {
      console.log("Error al obtener el servicio", error);
      res.status(404).json(error);
    } else {
      console.log("Servicio obtenido con exito", result);
      res.status(200).json(result);
    }
  })
})

app.get('/obtener-regiones', (req, res) => {

  obtenerRegiones((error, result) => {
    if (error) {
      console.log("Error al obtener las regiones", error);
      res.status(404).json(error);


    } else {
      console.log("Regiones obtenidas con exito", result);
      res.status(200).json(result)
    }
  })


})
app.get('/obtener-comunas', (req, res) => {

  obtenerComunas((error, result) => {
    if (error) {
      console.log("Error al obtener las Comunas", error);
      res.status(404).json(error);


    } else {
      console.log("Comunas obtenidas con exito", result);
      res.status(200).json(result);
    }
  })


})



app.get('/obtener-servicios', (req, res) => {
  obtenerServicios((error, result) => {
    if (error) {
      console.log("Error al obtener los servicios", error);
      res.status(404).json(error);

    } else {
      console.log("Servicios obtenidos con exito", result);
      res.status(200).json(result);
    }
  })
})

app.get('/listar-servicios', (req, res) => {
  listarServicios((error, result) => {
    if (error) {
      console.log("Error al obtener el listado de servicios", error);
      res.status(404).json(error);
    } else {
      console.log("Listado de servicios obtenido con exito", result);
      res.status(200).json(result);
    }
  })
})


app.get('/servicios-solicitados/:correoElectronico', (req, res) => {
  const correoElectronico = req.params.correoElectronico;
  obtenerServiciosSolicitadosPorTrabajador(correoElectronico, (error, resultados) => {
    if (error) {
      console.log("Error al obtener los servicios solicitados: ", error);
      res.status(500).json(error);
    } else {
      console.log("Servicios solicitados obtenidos con éxito: ", resultados);
      res.status(200).json(resultados);
    }
  });
});

app.get('/servicios-solicitados-cliente/:correoElectronico', (req, res) => {
  const correoElectronico = req.params.correoElectronico;
  obtenerServiciosSolicitadosPorCliente(correoElectronico, (error, resultados) => {
    if (error) {
      console.log("Error al obtener los servicios solicitados por cliente: ", error);
      res.status(500).json(error);
    } else {
      console.log("Servicios solicitados por cliente obtenidos con éxito: ", resultados);
      res.status(200).json(resultados);
    }
  });
});





app.put('/actualizar-solicitud/:id', (req, res) => {
  const solicitudId = req.params.id;
  const nuevoEstado = req.body.estado; // Obtén el nuevo estado del cuerpo de la solicitud

  aceptarSolicitud(solicitudId, nuevoEstado, (error, resultado) => {
    if (error) {
      console.log("Error al actualizar la solicitud: ", error);
      res.status(500).json(error);
    } else {
      console.log("Solicitud actualizada con éxito");
      res.status(200).json(resultado);
    }
  });
});

app.post('/agregar-resena', (req, res) => {
  const reseñaData = req.body;

  agregarReseña(reseñaData, (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Error al agregar reseña' });
    } else {
      return res.status(200).json({ mensaje: 'Reseña agregada con éxito' });
    }

  });
});





app.get('/obtener-trabajadorid/:correoElectronico', (req, res) => {
  const correoElectronico = req.params.correoElectronico;
  obtenerTrabajadorIdPorCorreo(correoElectronico, (error, resultados) => {
    if (error) {
      console.log("Error al obtener al trabajador solicitado: ", error);
      res.status(500).json(error);
    } else {
      console.log("trabajador solicitado obtenidos con éxito: ", resultados);
      res.status(200).json(resultados);
    }
  });
});


app.get('/obtener-solicitudid/:id_trabajador', (req, res) => {
  const trabajadorId = req.params.id_trabajador;
  obtenerSolicitudIdPorTrabajadorId(trabajadorId, (error, resultados) => {
    if (error) {
      console.log("Error al obtener la solicitud: ", error);
      res.status(500).json(error);
    } else {
      console.log("solicitud obtenida con éxito: ", resultados);
      res.status(200).json(resultados);
    }
  });
});

app.post('/registrar-trabajador', (req, res) => {
  const trabajadorData = req.body;

  registrarTrabajador(
    trabajadorData.disponibilidad,
    trabajadorData.des_perfil,
    trabajadorData.correo_electronico,
    (error, result) => {
      if (error) {
        console.error('Error al registrar el trabajador:', error);
        res.status(500).json({ error: 'Error interno al registrar el trabajador' });
      } else {
        console.log('Trabajador registrado con éxito');
        res.status(200).json({ message: 'Trabajador registrado con éxito' });
      }
    }
  );
});

app.post('/agregar-favorito', (req, res) => {
  const { id_usuario, id_trabajador } = req.body;

  if (!id_usuario || !id_trabajador) {
    return res.status(400).json({ error: 'Falta información requerida.' });
  }

  agregarFavorito(req, res);
});

app.post('/quitar-favorito', (req, res) => {
  const { id_usuario, id_trabajador } = req.body;

  if (!id_usuario || !id_trabajador) {
    return res.status(400).json({ error: 'Falta información requerida.' });
  }

  quitarFavorito(req, res);
});

app.post('/verificar-favorito', (req, res) => {
  if (!req.body.id_usuario || !req.body.id_trabajador) {
    return res.status(400).json({ error: 'Falta información requerida.' });
  }

  verificarFavorito(req, res);
});

app.post('/listar-favoritos', (req, res) => {
  listarFavoritos(req, res);
});



app.post('/agregar-documentacion', (req, res) => {
  const trabajadorId = req.params.id_solicitud;
  const documentData = req.body;

  agregarDocumentacionTrabajador(documentData, (error, result) => {
    if (error) {
      console.log("Error al agregar documentacion", error);
      res.status(500).json({ error: "Error interno al agregar documentacion" });
    } else {
      console.log("Documentacion agregada con exito", result);
      res.status(200).json({ message: "Documentacion agregada con exito" });
    }
  }
  );
});





app.get('/promedio-calificacion-servicio/:id_des_serv/:id_trabajador', (req, res) => {
  const idServicio = req.params.id_des_serv;
  const trabajadorId = req.params.id_trabajador;
  calcularPromedioCalificacionServicio(idServicio, trabajadorId, (error, result) => {
    if (error) {
      console.log("Error al obtener el promedio de calificaciones por servicio", error);
      return res.status(500).json({ error: "Error interno al obtener promedio de calificaciones" });

    } else {
      console.log("Promedio de calificaciones por servicio obtenido con éxito", result);
      return res.status(200).json(result);
    }
  });
})




app.get('/promedio-calificaciones-trabajador/:correoElectronico', (req, res) => {
  const correoElectronico = req.params.correoElectronico;
  calcularPromedioCalificacionTrabajador(correoElectronico, (error, result) => {
    if (error) {
      console.log("Error al obtener el promedio de calificaciones por trabajador", error);
      return res.status(500).json({ error: "Error interno al obtener promedio de calificaciones por trabajador" });


    } else {
      console.log("Promedio de calificaciones por trabajador obtenido con éxito", result);
      return res.status(200).json(result);
    }
  })
});

app.put('/actualizar-disponibilidad', (req, res) => {
  const { correo_electronico, disponibilidad } = req.body;

  actualizarDisponibilidad(correo_electronico, disponibilidad, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al actualizar la disponibilidad' });
    } else {
      res.status(200).json({ message: 'Disponibilidad actualizada con éxitoo' });
    }
  });
});

app.put('/emitir-reporte/:id_resena', (req, res) => {
  const nuevoEstado  = req.body.estado;
  const resenaId = req.params.id_resena;
  emitirReporteResena(resenaId, nuevoEstado,  (error, results) => {
    if (error) {
      console.log("Error al emitir el reporte");
      res.status(500).json(error);
    }else{
      console.log("reporte emitido correctamente", nuevoEstado);
      res.status(200).json(results);
    }
  })
})

app.get('/obtener-resenas-admin', (req, res) => {
  getReseñasAdmin((error, result)=>{
    if (error) {
      console.log("Error al obtener las reseñas reportadas");
      res.status(500).json(error);
    }else{
      console.log("Reseñas reportadas obtenidas con exito");
      res.status(200).json(result);
    }
  })
}
)


app.put('/modificar-resena/:id_resena', (req, res) => {
  const resenaId = req.params.id_resena;
  const resenaData = req.body;
  modificarResena(resenaId, resenaData, (error, resultado) => {
    if (error) {
      console.error('Error al modificar la reseña:', error);
      res.status(500).json(error);
    } else {
      console.log('Reseña modificada con éxito');
      res.status(200).json(resultado);
    }
});
});
app.post('/agregar-visita', (req, res) => {
  const visitaData = req.body;

  agregarVisitaConSolicitud(visitaData, (error, result) => {
    if (error) {
      console.log("Error al agregar la visita", error);
      res.status(500).json({ error: "Error interno al agregar la visita" });
    } else {
      console.log("Visita agregada con éxito con ID de solicitud", result);
      res.status(200).json({ message: "Visita agregada con éxito" });
    }
  });
});

app.post('/visitas-agendadas', (req, res) => {

  const correoTrabajador = req.body.correoTrabajador;

  if (!correoTrabajador) {
    return res.status(400).json({ error: 'El correo del trabajador es requerido' });
  }

  visitasAgendadas(correoTrabajador, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

app.post('/visitas-agendadas-cliente', (req, res) => {

  const correoCliente = req.body.correoCliente;

  if (!correoCliente) {
    return res.status(400).json({ error: 'El correo del cliente es requerido' });
  }

  horasAgendadasParaCliente(correoCliente, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});
app.get('/listar-resena-trabajador/:trabajadorId',(req,res)=>{
  const trabajadorId = req.params.trabajadorId;

  listarReseñaPorTrabajador(trabajadorId,(error, result)=>{
    if (error) {
      console.log("Error al obtener el listado de reseñas por trabajador", error);
      return res.status(500).json(error);

    }else{
      console.log("Listado de reseñas por trabajador obtenido con exito");
      return res.status(200).json(result);
    }
  })
});
//Esta es para un historial de reseñas por trabajador, botón que irá en el menú



app.get('/listar-resena/:correoElectronicoo/:solicitudId',(req, res)=> {
  const correoElectronicoo = req.params.correoElectronicoo;
  const solicitudId = req.params.solicitudId;
  listarReseña(correoElectronicoo,solicitudId, (error, result)=>{
    if (error) {
      console.log("Error al obtener la reseña", error);
      return res.status(500).json(error);

    }else{
      console.log("Reseña obtenida exitosamente");
      return res.status(200).json(result);
    }
  });
});
//Esta es para listar las reseñas de cada solicitud con estado "Finalizado"

app.get('/obtener-resenas/:correoElectronico', (req, res)=>{
  const correoElectronico = req.params.correoElectronico;
  obtenerResenas(correoElectronico, (error,result)=>{
    if (error) {
      console.log("Error al obtener las reseñas", error);
      return res.status(500).json(error);

    }else{
      console.log("Reseñas obtenidas correctamente");
      return res.status(200).json(result);
    }
  });
});

app.get('/listar-resena-especifica/:id_resena', (req,res)=>{
  const resenaId = req.params.id_resena;
  obtenerResenaEspecifica(resenaId, (error, result)=> {
    if (error) {
      console.log("Error al obtener la resena especifica", error);
      return res.status(500).json(error)
    }else{
      console.log("Resena especifica obtenida con exito");
      res.status(200).json(result);
    }
});
});







const puerto = 4001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permite solicitudes desde localhost:8100
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*'); // Puedes ajustar los métodos permitidos según tus necesidades
  next();
});

app.listen(puerto, () => {
  console.log(`api funcionando en el puerto ${puerto}`);
});

