const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'3195704a',
    database:'jobby_job',
})

connection.connect((err)=>{
    if(err){
        console.log("error al conectarse a la base de datos: "+err.message);

    }else{
        console.log('Conexion exitosa!');
    }

});

module.exports=connection;