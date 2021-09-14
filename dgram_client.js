var dgram = require('dgram');

var client = dgram.createSocket('udp4');

var bind_port = process.argv[2] || false
var remote_addr = process.argv[3] || false
var remote_port = process.argv[4] || false

client.on('error', (err) => {

  console.log(`client error:\n${err.stack}`);

  client.close();

});

// client.on('message', (msg, rinfo) => {
//
//   console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
// 	client.send("got u!", rinfo.port, rinfo.address)
//
// });

client.on('connect', () => {

	console.log("something is connecting.")
  
  const message = Buffer.from('Some bytes');

  client.send(message)

})

client.on('listening', () => {

  var address = client.address();

  console.log(`client listening ${address.address}:${address.port}`);

});


client.bind(bind_port);
client.connect(remote_port, remote_addr)

// Prints: client listening 0.0.0.0:41234
