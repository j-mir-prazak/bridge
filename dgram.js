var dgram = require('dgram');
var StringDecoder = require('string_decoder')

var decoder = new StringDecoder.StringDecoder('utf8')
var server = dgram.createSocket('udp4')

var register = {}


server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {

	var data = decoder.write(msg)

	if ( data.match(/secret\:.*\:secret/) ) {

		var secret_string = data.replace(/secret\:(.*)\:secret/,"$1")

		if ( register[secret_string] ) {


			console.log("got match.")

			console.log(register[secret_string])

			console.log({

				command: "connect",
				address: rinfo.address,
				port: rinfo.port

			})

			console.log({

				command: "connect",
				address: register[secret_string].address,
				port: register[secret_string].port

			})


			server.send( JSON.stringify({

				command: "connect",
				address: rinfo.address,
				port: rinfo.port

			}), register[secret_string].port, register[secret_string].address )




			server.send( JSON.stringify({

				command: "connect",
				address: register[secret_string].address,
				port: register[secret_string].port

			}), rinfo.port, rinfo.address )

			delete register[secret_string]

			// register[secret_string].socket.end()


		}

		else {

			console.log("registration.")

			register[secret_string] = {

				port: rinfo.port,
				address: rinfo.address,
				secret: secret_string

				}

			}




	}

	else {

		console.log(data)

		server.send(Buffer.from(data))

		}

});

server.on('connect', () => {

	console.log("something is connecting.")

})

server.on('listening', () => {

  var address = server.address();

  console.log(`server listening ${address.address}:${address.port}`);

});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
