var net = require('net');
var StringDecoder = require('string_decoder');
var decoder = new StringDecoder.StringDecoder('utf8');
var fs = require('fs')

var listen_addr = '0.0.0.0'
var server_bank = '20000'

var servers = new Array()

var ports = new Array()


for( var i = 8000; i < 9000; i++) {

	ports.push(i)

}




var banker = net.createServer(function(socket) {

	var input = socket
	console.log(input.remoteAddress)
	console.log(input.remotePort)

	input.end("die\n")

	input.on('error', function(e){
		console.log('banker connection abruptly ended.')
	})

	// socket.on('data', function(d){

		// var data = decoder.write(d).replace(/\r?\n/g, "")
		//
		// console.log(d)
		// console.log( data == secret )
		// console.log(data)
		// console.log(secret)


	// })
})

banker.listen(server_bank, listen_addr)
