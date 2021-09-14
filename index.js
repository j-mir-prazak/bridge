var net = require('net');
var StringDecoder = require('string_decoder');
var decoder = new StringDecoder.StringDecoder('utf8');
var fs = require('fs')

var listen_addr = '0.0.0.0'
var server_bank = process.argv[2] || 9300

var servers = new Array()

var ports = new Array()


for( var i = 8000; i < 9000; i++) {

	ports.push(i)

}

var register = {}


var banker = net.createServer(function(socket) {

	var input = socket
	var secret = ""

	console.log(input.remotePort + " " + input.remoteAddress)
	// console.log(input.remoteAddress)

	input.on( 'error', function(e) {

		console.log('banker connection abruptly ended.')

	} )

	input.on('data', (d) => {

		var data = decoder.write(d)
		if ( data.match(/secret\:.*\:secret/) ) {


			var secret_string = data.replace(/secret\:(.*)\:secret/,"$1")

			secret = secret_string

			if ( register[secret_string] ) {


				console.log("got match.")

				register[secret_string].socket.write( JSON.stringify({

					command: "connect",
					address: input.remoteAddress,
					port: input.remotePort

				}) )

				input.write( JSON.stringify({

					command: "connect",
					address: input.remoteAddress,
					port: input.remotePort

				}) )

				register[secret_string].socket.end()


			}

			else {

				console.log("registration.")

				register[secret_string] = {

					socket: input,
					secret: secret_string

					}

				}


		}

	})

	input.on('end', () => {

		if ( secret && register[secret] && input == register[secret].socket  ) {

			console.log('deleting registration.')
			delete register[secret]

		}

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
