const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { registroUsuario, iniciarSesion, obtenerDatosUsuarioPorCorreo, agregarServicio, enviarSolicitud, obtenerDatosTrabajadorPorCorreo, obtenerServiciosSolicitadosPorTrabajador, aceptarSolicitud,obtenerRegiones,obtenerComunas,obtenerServicios,listarServicios, agregarReseña } = require('./controller');
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
//app.post('/agregar_servicio', (req, res) => {
// Validar el token del trabajador aquí

// Insertar el servicio en la base de datos
//  const serviceData = req.body;
//db.query('INSERT INTO descrip_servicio SET ?', serviceData, (err, result) => {
//if (err) {
//console.error('Error al agregar el servicio', err);
//res.status(500).json({ error: 'Error al agregar el servicio' });
//} else {
//console.log('Servicio agregado con éxito');
//res.status(200).json({ message: 'Servicio agregado con éxito' });
// }
//});
//});
app.post('/agregar_servicio', (req, res) => {
  // Validar el token del trabajador aquí (debe implementarse)

  // Insertar el servicio en la base de datos
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

app.get('/obtener-datos-trabajador/:correo', (req, res) => { // get de los datos encesario para obtener los datos del trabajador 
  const correoElectronico = req.params.correo;

  
  obtenerDatosTrabajadorPorCorreo(correoElectronico, (error, datosTrabajador) => {
    if (error) {
      console.log("Error al obtener los datos del trabajador: ", error);
      res.status(404).json(error);
    } else {
      console.log("Datos del trabajador obtenidos con éxito: ", datosTrabajador);
      res.status(200).json(datosTrabajador);
    }
  });
});

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

app.post('/agregar-resena/:id_solicitud',(req,res)=>{
  const solicitudId = req.params.id_solicitud;
  const reseñaData = req.body;
  agregarReseña(reseñaData,(error, result)=> {
    if (error) {
      console.log("Error al agregar reseña", error);
      res.status(500).json(error);
      
    }else{
      console.log("Reseña agregada con exito");
      res.status(200).json(result)
    }
  })

});

const puerto = 4001;

app.listen(puerto, () => {
  console.log(`api funcionando en el puerto ${puerto}`);
});

