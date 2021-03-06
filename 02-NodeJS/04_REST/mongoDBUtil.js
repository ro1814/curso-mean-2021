const mongodb = require("mongodb")

//'exports' es un objeto implícito que de entrada no tiene propiedades
//Le vamos añadiendo lo que queremos exportar como valores de propiedades

exports.esquema = null

exports.conectarBBDD = function(callback, callbackError){

    //¿deberíamos comprobar que los parámetros recibidos son funciones?

    console.log("Conectando con la base de datos...")
    let url = "mongodb://localhost:27017"
    let client = new mongodb.MongoClient(url)
    client.connect()
        .then( function(dbs){
            console.log("Conexion establecida")
            exports.esquema = dbs.db("esquema_discos")
            callback(dbs)
        })
        .catch(function(err){
            console.log("Error al conectar con la base de datos", err)
            if(callbackError){
                callbackError()
            }
        })
    
}