const http =require('http')


let servidor = http.createServer( function( request, response ){

    console.log("Petición recibida")

    response.end()

})

//La función 'listen' es asíncrona
servidor.listen(2000, function(){})