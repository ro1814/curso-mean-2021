
//npm install mongodb
const mongoDB = require("mongoDB")

/////////////////////
// MONGO DB CLIENT //
/////////////////////

//Funciones asíncronas:
//-mongoClient.connect

//Funciones síncronas:
//-

//////////////////////////////////
//Obtener una conexión a MongoDB//
//////////////////////////////////


//
//mongodb://<ip>:<puerto>[/esquema]
//
const url = "mongodb://localhost:27017"


//Creamos el objeto 'MongoClient'


const client = new mongoDB.MongoClient(url)


console.log("Conectando a mongoDB...")

client.connect(function(err, dbs){
    if(err){
        console.log("Error al conectar",err)
        return
    }
    console.log("Conexión establecida")
})

console.log("FIN")