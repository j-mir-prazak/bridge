var net = require('net');
var StringDecoder = require('string_decoder');
var decoder = new StringDecoder.StringDecoder('utf8');
var fs = require('fs')

var listen_addr = '0.0.0.0'
var local_port = 40000

var secret_string = process.argv[2] || 'bigfatsecret'
var remote_server = process.argv[3] || '127.0.0.1'

var remote_port = process.argv[4] || 9300

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

		console.log(input.remoteAddress)
		console.log(input.remotePort)

		input.on('error', function(e){

			console.log('server connection abruptly ended.')

		})

		input.on('close', function(e){

			console.log('server connection ended.')

		})

		socket.on('data', function(d){

			var data = decoder.write(d).replace(/\r?\n/g, "")
			console.log("data")

		})
	})

	server.listen(port, listen_addr)


	}

function setupConnection(port, address) {

	var client = new net.Socket();

	client.on('connect', (s) => {

		console.log("connected.")

		client.write("hi, server")
		client.end()

	})


	}




var banker = net.createServer(function(socket) {

	var input = socket
	console.log(input.remoteAddress)
	console.log(input.remotePort)


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

// banker.listen(local_port, listen_addr)

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

				console.log("setup server")

				setupServer(client.localPort)


			}

			else if ( data.command == "connect" ) {

				setupConnection(data.port, data.address)

			}

		}
		catch (e) {

			console.log("no json.")

		}

	}



})

client.connect({

	port:remote_port,
	host:remote_server
	// localPort: local_port

})
