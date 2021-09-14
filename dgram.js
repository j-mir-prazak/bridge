var dgram = require('dgram');

var server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {

  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
	server.send("got u!", rinfo.port, rinfo.address)

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
