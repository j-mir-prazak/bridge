var net = require('net');
var StringDecoder = require('string_decoder');
var decoder = new StringDecoder.StringDecoder('utf8');
var fs = require('fs')

var listen_addr = '0.0.0.0'
var server_bank = process.argv[2] || 9900

var register = {}


var echo = net.createServer(function(socket) {

	// console.log("echo.")

	var input = socket

	input.on( 'error', function(e) {

		console.log('echo connection abruptly ended.')

	} )

	input.on('readable', () => {

		console.log( input.read() )

	})


})

echo.listen(server_bank, listen_addr)
