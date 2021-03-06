//npm install validatorjs
const validacionUtil = require("../../util/validacionUtil")
const Usuario = require("../entidades/esquemaUsuario").Usuario
const UsuarioHistorico = require("../entidades/esquemaUsuarioHistorico").UsuarioHistorico

let reglasUsrInsercion = {
    login    : "required|min:3|max:20",
    password : "required|min:3|max:20",
    nombre   : "required|min:3|max:50",
    correoE  : "required|min:3|max:30|email"
}

let reglasUsrModificacion = {
    nombre    : "required|min:3|max:50",
    correoE   : "required|min:3|max:30|email",
    telefono  : "required|min:3|max:20",
    direccion : "required|min:3|max:50"
}

exports.buscarPorLoginYPw = function(login, password){
    return new Promise(function(resolve, reject){
        //Con mongoose utilizamos el modelo para buscar
        Usuario.findOne({ login:login, password:password }, '-password -__v' )
            .then(usuarioEncontrado => {
                if(!usuarioEncontrado){
                    reject({ codigo:404, mensaje:"No existe un usuario con este login y password" })
                    return
                }
                //delete usuarioEncontrado.password
                console.log(usuarioEncontrado)
                resolve(usuarioEncontrado)
            })
            .catch(err => {
                console.log(err)
                reject({ codigo:500, mensaje:"Error con la base de datos!!!" })
            })    
    })   
}

//Autenticación : ninguna
//Autorización  : ninguna
exports.altaUsuario = function(usuario){

    return new Promise(function(resolve, reject){
        
        validacionUtil.validar(usuario, reglasUsrInsercion, reject)

        //Le asigmanos el rol 'CLIENTE'
        usuario.rol = "CLIENTE"

        Usuario
            .findOne({ login : usuario.login})
            .then(function(usuarioEncontrado){
                if(usuarioEncontrado){
                    reject({ codigo:400, mensaje:"Ya existe un usuario con ese login" })
                    return
                }                
                let usuarioMG = new Usuario(usuario)
                return usuarioMG.save() 
            })
            .then(function(resultado){
                console.log("Usuario insertado")
                console.log(resultado)
                resolve(resultado._id) //Todo fue bien :)
            })
            .catch(function(err){
                console.log(err)
                reject({ codigo:500, mensaje:"Error con la base de datos!!!" })
            })
    })

}

//Autenticación: si
//Autorización :
//-empleados: pueden modificar cualquier usuario
//-clientes : solo pueden modificarse a si mismos
exports.modificarUsuario = function(usuario, autoridad){
    
    return new Promise(function(resolve, reject){

        //Validación
        validacionUtil.validar(usuario, reglasUsrModificacion, reject)
                    
        //Autorización 
        if(autoridad.rol=="CLIENTE" && autoridad._id!=usuario._id){                        
            reject( { codigo:403, 
                        mensaje:'Los clientes solo pueden modificarse a si mismos' } ) //Mal
            return
        }
    
        //Modificar
        Usuario.findByIdAndUpdate(usuario._id, usuario)
        .then( resultado => {
            if(!resultado){
                reject({ codigo:404, mensaje:"El usuario no existe"})
                return
            }
            resolve()
        })
        .catch( error => {
            console.log(error)
            reject({ codigo:500, mensaje:"Error con la base de datos"})
        })

    })

}

//Autenticación: si
//Autorización :
//-empleados: si
//-clientes : solo pueden borrarse a si mismos
exports.bajaUsuario = function(idUsuario, autoridad){

    return new Promise(function(resolve,reject){

        console.log("Autoridad:", autoridad, "idUsuario:", idUsuario)

        //Autorización
        if(autoridad.rol=="CLIENTE" && autoridad._id != idUsuario){
            reject({ codigo:403, mensaje:"Un cliente solo puede darse de baja a si mismo"})
            return
        }

        let usuarioEncontrado = null

        Usuario
            .findById(idUsuario) 
            .then( usr => { //Este objeto lo ha creado mongoose y tiene las funciones chupis de persistencia
                usuarioEncontrado = usr
                if(!usuarioEncontrado){
                    reject({ codigo:404, mensaje:"El usuario no existe" })
                    return
                }
                return usr.remove()
            })
            .then(resultadoDelete => {
                console.log("DELETE:", resultadoDelete)
                /*Grán fajador
                let datos = {
                    _id       : usuarioEncontrado._id,
                    login     : usuarioEncontrado.login,
                    password  : usuarioEncontrado.password,
                    rol       : usuarioEncontrado.rol,
                    nombre    : usuarioEncontrado.nombre,
                    direccion : usuarioEncontrado.direccion,
                    telefono  : usuarioEncontrado.telefono,
                    correoE   : usuarioEncontrado.correoE,
                    idioma    : usuarioEncontrado.idioma                    
                }  
                let usuarioHistorico = new UsuarioHistorico(datos)
                */                           
                
                //Fino estilista
                //Datos ya no es un objeto mongoose, ya no tiene las funciones, solo tiene las propiedades que guardan los datos
                let datos = usuarioEncontrado.toObject()
                let usuarioHistorico = new UsuarioHistorico(datos)
                return usuarioHistorico.save()
            })
            .then( resultadoInsertOne => {                
                console.log("INSERT:", resultadoInsertOne)
                resolve()
            })
            .catch(error => {
                console.log(error)
                reject({ codigo:500, mensaje:"Error con la base de datos!!!" })
            })

    })

}









