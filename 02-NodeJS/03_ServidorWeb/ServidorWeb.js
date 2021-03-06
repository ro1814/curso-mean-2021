const http = require("http")
const fs   = require("fs")


///////////////////////////////////////////////////////////////////////////
// SERVER                                                                //
///////////////////////////////////////////////////////////////////////////

let servidor = http.createServer(procesarPeticion)

//La funcion 'listen' es asíncrona
servidor.listen(2000, function(){ 
    console.log("Esperando peticiones en el puerto 2000") 
})

///////////////////////////////////////////////////////////////////////////
// VALORES GLOBALES                                                      //
///////////////////////////////////////////////////////////////////////////

let statusCodes = {
    400 : 'Petición incorrecta',
    404 : 'Recurso no encontrado',
    405 : 'Método no permitido',
    415 : 'Media Type no soportado'
} 

let mimeTypes = {
    html : 'text/html',
    css  : 'text/css',
    js   : 'application/javascript',
    //ico  : 'image/x-icon'
}

///////////////////////////////////////////////////////////////////////////
// CÓDIGO                                                                //
///////////////////////////////////////////////////////////////////////////

function procesarPeticion(request, response){

    let metodo = request.method
    let url    = request.url
    
    console.log("========================================================")
    console.log("Petición recibida: "+metodo+" "+url)

    //Solo vamos a aceptar peticiones GET
    if( metodo.toUpperCase() != "GET"){
        devolverError(response, 405)
        return
    }
    
    leerRecurso(url, response)

} 

function leerRecurso(url, response){
    //ReadFileSync dejará bloqueado al hilo principal!!!!!
    //return fs.readFileSync("./recursos"+url)

    let ruta = "./recursos"+url
    fs.readFile(ruta, function(error, buffer){
        if(error){
            console.log("Fallo al leer el fichero:") //, error)
            devolverError(response, 404, "Recurso no encontrado!!!!!!!!!")
            return
        } 

        let extensionRecurso = url.split(".").pop()
        let mimeType = mimeTypes[extensionRecurso]
        if(!mimeType){
            devolverError(response, 415)
            return
        }

        response.setHeader('Content-type', mimeType)
        let contenido = buffer.toString()
        response.end(contenido)
    })
}

//mensaje es un parámetro opcional
function devolverError(response, statusCode, mensaje){

    response.setHeader('Content-type', mimeTypes.html)
    //Response no admite valores incorrectos en 'statusCode'
    response.statusCode = statusCode

    if(!mensaje){
        mensaje = statusCodes[statusCode]
    }

    let html = `
        <html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <h1 align="center">
                    <font color="lightGreen">
                        WebServer 3000
                    </font>
                </h1>
                <h2 align="center">
                    <font color="lightBlue">
                        Se ha producido un error
                    </font>
                </h2>
                <h1 align="center">
                    <font color="red">
                        ${statusCode}
                    </font>
                    ${mensaje}
                </h1>
            </body>
        </html>`

    response.end(html)
}

