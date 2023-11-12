const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'45.236.128.233',
    port:'3306',
    user:'diego',
    password:'Portafolio1*',
    database:'Jobby',
})

connection.connect((err)=>{
    if(err){
        console.log("error al conectarse a la base de datos: "+err.message);

    }else{
        console.log('Conexion exitosa!');
    }

});

module.exports=connection;