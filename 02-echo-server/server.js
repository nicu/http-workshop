const net = require('net');

const PORT = 3000;
const HOST = 'localhost';

const server = net.createServer(client => {
  console.log('Client connected');
  client.write('Welcome');
  let buffer = '';
  client.on('data', data => (buffer += data.toString()));
  client.on('end', () => {
    client.write(buffer);
    buffer = '';
  });
  client.on('close', () => console.log('Client disconnected'));
});

server.listen(PORT, HOST, () => {
  console.log('Echo server listening on port', PORT);
});
