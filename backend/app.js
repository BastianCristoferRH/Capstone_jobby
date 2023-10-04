const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { listarFavoritos,verificarFavorito,eliminarServicio,agregarFavorito, quitarFavorito, registroUsuario, iniciarSesion,servEspecifico, obtenerDatosUsuarioPorCorreo, agregarServicio, enviarSolicitud, servEspecifico, modificarServicio, obtenerDatosTrabajadorPorCorreo, obtenerServiciosSolicitadosPorTrabajador,obtenerServiciosSolicitadosPorCliente, aceptarSolicitud, obtenerRegiones, obtenerComunas, obtenerServicios, listarServicios, agregarReseña, obtenerTrabajadorIdPorCorreo, obtenerSolicitudIdPorTrabajadorId, registrarTrabajador } = require('./controller');
const { ifError } = require('assert');


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

app.post('/agregar-resena/:id_solicitud', (req, res) => {
  const solicitudId = req.params.id_solicitud;
  const reseñaData = req.body;
  agregarReseña(solicitudId, reseñaData, (error, result) => {
    if (error) {
      console.log("Error al agregar reseña", error);
      res.status(500).json(error);

    } else {
      console.log("Reseña agregada con exito");
      res.status(200).json(result)
    }
  })

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


const puerto = 4001;

app.listen(puerto, () => {
  console.log(`api funcionando en el puerto ${puerto}`);
});

