var dgram = require('dgram');

var client = dgram.createSocket({type:'udp4',reuseAddr:true});

var peer = null

var bind_port = process.argv[2] || false
var remote_addr = process.argv[3] || false
var remote_port = process.argv[4] || false

client.on('error', (err) => {

  console.log(`client error:\n${err.stack}`);

  client.close();

});

client.on('message', (msg, rinfo) => {

  console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  if ( peer == null ) {
   var json = JSON.parse(msg)
    console.log(json)


    if ( json && json.port && json.address ) {


      // client.close()
      // peer = true
      // client.connect(json.port,json.address)
      // setInterval(function(){
      //   var message = Buffer.from('Some bytes');
      //   client.send(message, json.port, json.address, function(){console.log("sent.")})
      // }.bind(null,json),20)
      var date = Date.now()
      if ( json.order == "a" ) {
        console.log("on NAT")
        peer = setupPeer(json.port, json.address, json.date - date)

      }
      else if ( json.order == "b" ) {

        console.log("free of NAT")
        peer = setupPeer(json.port, json.address, json.date - date)


      }

    }
  }

  else {

    console.log("peer message")


  }

});

client.on('connect', () => {


  if ( peer == null ) {
  	console.log("connecting somewhere.")
    var message = Buffer.from('secret:abcedf:secret');
    client.send(message)
  }


})

client.on('listening', () => {

  var address = client.address();
  console.log(`client listening ${address.address}:${address.port}`);

});

client.on('close', () => {

  console.log("closed.")

});




client.bind(bind_port)
client.connect(remote_port, remote_addr)

// Prints: client listening 0.0.0.0:41234
function setupPeer(port, address, timeout, local) {

  var peer = dgram.createSocket({type:'udp4',reuseAddr:true});
  var local = local || false

  peer.on('message', (msg, rinfo) => {

    console.log(msg)

  });

  peer.on('connect', () => {

    connect = true

    var message = Buffer.from('peer message.')
    peer.send(message)




  	// console.log("connected as peer.")
    // // console.log(peer)
    // setInterval(function() {
    //
    //
    //       peer.connect(port, address)
    //       console.log(message)
    //
    //       // peer.connect(remote_port,remote_addr)
    //       // peer.send(message, remote_port, remote_addr)
    //       // peer.close()
    //     }, 20)
    // // peer.send(message)

  })

  peer.on('listening', () => {

    console.log('listening as peer.')

  });

  peer.on('close', () => {
    // console.log(peer)
    console.log('peer closed.')

  });

  peer.on('error', () => {
    console.log("error.")
  })


  var timeout = timeout || 0
  var connect = false

  peer.bind(bind_port, '0.0.0.0')


  if ( local ) {

    setTimeout(function() {

      console.log("timeout.")

        if ( ! connect ) {

          connect = true
          // console.log(peer)
          peer = dgram.createSocket({type:'udp4',reuseAddr:true});
          peer.bind(bind_port, '0.0.0.0')
          peer.connect(port, address)


          peer.on('connect', () => {

            connect = true
            console.log("connected.")
            setTimeout(function(){

              peer.disconnect()

            }, 50)


          })
          
          peer.on('error', () => {
            console.log("fail.")
          })

          peer.on('message', (msg, rinfo) => {

            console.log( "incomming: " + msg)

          })

          peer.on('close', () => {
            console.log("closed.")
          })



        }

    }.bind(null, port, address), timeout)




  }

  else {

    setTimeout(function() {

      console.log("timeout.")

      setInterval(function() {

        if ( ! connect ) {

          connect = true
          // console.log(peer)
          peer = dgram.createSocket({type:'udp4',reuseAddr:true});
          peer.bind(bind_port, '0.0.0.0')
          peer.connect(port, address)


          peer.on('connect', () => {

            connect = true

            var message = Buffer.from('peer message.')
            peer.send(message)


          })

          peer.on('message', (msg, rinfo) => {

            console.log("incomming: " + msg)

          });

          peer.on('error', () => {
            console.log("fail.")
          })


          setTimeout(function(){

            peer.close(function() {
              // console.log("callback")
              connect = false

            })

          }, 500)
        }
      }.bind(null,port,address),20)

    }.bind(null, port, address), timeout)



  }




  // console.log(peer)
  // peer.connect(remote_port, remote_addr)


}
