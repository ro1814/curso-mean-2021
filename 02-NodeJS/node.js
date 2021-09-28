console.log("Hello, World")

//Modulos en node

const http = require("http")

let servidorHTTP = http.createServer( function(request, response ){
    console.log("Petición recibida en el puerto 1000")

    response.setHeader('content-type', 'text/html')

    //let body = "<html><head><body><h1>Hola, Rodi</h1></body></head></html>"
    let body = crearHTML()

    response.end(body)

})

servidorHTTP.listen(1000)