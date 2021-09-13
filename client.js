var net = require('net');
var StringDecoder = require('string_decoder');
var decoder = new StringDecoder.StringDecoder('utf8');
var fs = require('fs')

var listen_addr = '0.0.0.0'
// var local_port = 40000

var secret_string = process.argv[2] || 'bigfatsecret'

var remote_server = process.argv[3] || '127.0.0.1'
var remote_port = process.argv[4] || 9300

var local_port = parseInt(process.argv[5]) || 40000

var local_server = false

var servers = new Array()

var ports = new Array()


for( var i = 8000; i < 9000; i++) {

	ports.push(i)

}

function setupServer(port) {

	console.log("setup on port " + port)

	var port = port || false

	var server = net.createServer(function(socket) {

		var input = socket

		console.log("connected!")

		console.log(input.remoteAddress)
		console.log(input.remotePort)

		input.on('error', function(e){

			console.log('server connection abruptly ended.')

		})

		input.on('close', function(e){

			console.log('server connection ended.')

		})

		socket.on('data', function(d){

			// var data = decoder.write(d).replace(/\r?\n/g, "")
			console.log("data")

		})
	})

	server.listen({
		port: port,
		host: listen_addr,
		exclusive: false,
		allowHalfOpen: true
	})
	return server

	}

function setupConnection(port, address) {

	var address = address
	var port = port

	console.log(port + " " + address)

	var client = new net.Socket();

	client.on('connect', (s) => {

		console.log("connected.")

		client.write("hi, server")
		client.end()

	})

	client.connect({

		port: port,
		host: address
		// localPort: local_port

	})

	// console.log(client)


}


// var server = setupServer(local_port)



var client = new net.Socket();

client.on('connect', (s) => {

	console.log("connected.")

	console.log(client.localPort)

	client.write("secret:"+secret_string+":secret")

})

client.on('close', (c) => {

		console.log('closed.')


})


client.on('ready', (c) => {

	console.log('ready.')

})

client.on('ended', (c) => {

	console.log('ended.')

})

client.on('readable', (c) => {

	var data = client.read()


	// console.log('readable.')
	if ( data != null) {

		try {

			data = JSON.parse( decoder.write( data ) )
		 	console.log( data )
			// console.log(client.localPort)

			if ( data.command == "server" ) {

				console.log("setup server.")

				local_server = client.localPort

				// client.destroy()

			}

			else if ( data.command == "connect" ) {

				console.log("setup connection.")

				setTimeout( function() {
					setupConnection( data.port, data.address )
				}.bind(null, data.port, data.address), 200 )

			}

		}
		catch (e) {

			console.log("no json.")

		}

	}



})

client.connect({

	port:remote_port,
	host:remote_server,
	localPort: local_port,
	exclusive: false,
	allowHalfOpen: true

})
