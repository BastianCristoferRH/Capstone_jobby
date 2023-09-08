const db = require('./db');


function registroUsuario(usuario,callback){
    const sql = 'INSERT INTO tu_tabla (correo_electronico, nombre, img, apellidos, telefono, fecha_creacion, fecha_nacimiento, conexion, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const valores= [ 
        usuario.correo_electronico,
        usuario.nombre,
        usuario.img=null,
        usuario.apellido,
        usuario.telefono,
        usuario.fecha_creacion,
        usuario.fecha_nacimiento,
        usuario.conexion,
        usuario.password
    ];

    db.query(sql,valores,(err,resultado)=>{
        if (err) {
            console.log("error al insertar a la base de datos: ",err);
            callback(err,null);
        }else{
            console.log("se ingresaron los valores con exito: ",resultado);
            callback(null,resutlado);
        }
    });

    module.exports={
        registroUsuario
    }
}
