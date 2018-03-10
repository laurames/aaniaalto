var SerialPort = require('serialport');
//The SeiralPort('YOUR_OWN_SERIALPORT_WHERE_HARDWARE_IS_CONNECTED')
var port = new SerialPort('/dev/cu.usbmodem621', {
  baudRate: 9600
});

//listening to box:
port.on('open', () => {
  console.log('Port Opened');
});

port.on('data', (data) => {
  // get a buffer of data from the serial port
  console.log(data.toString());
  //now do stuff to the data received:
  //getPlaylistSend(data.toString(), spotifyApi.access_token);
});
