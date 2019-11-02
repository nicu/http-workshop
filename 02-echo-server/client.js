const net = require('net');

const PORT = 3000;
const HOST = 'localhost';

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to echo server');
  client.write('Echo');
  client.end();
});

client.on('data', data => {
  console.log('Received: ', data.length, data.toString());
});

client.on('close', () => {
  console.log('Connection closed');
});
