const net = require('net');
const readline = require('readline');

const HOST = '127.0.0.1';
const PORT = 1337;
const SEP = '\r\n';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new net.Socket();
client.connect(PORT, HOST, () => {
  console.log('Connected');
  rl.prompt();
});

client.on('data', data => {
  data
    .toString()
    .split(SEP)
    .forEach(response => {
      console.log(response);
    });

  rl.prompt();
});

client.on('close', () => {
  console.log('Connection closed');
  rl.close();
});

rl.on('SIGINT', () => {
  client.destroy();
});

rl.on('line', input => {
  client.write(input, function(err) {
    if (err) {
      client.destroy();
      throw err;
    }
  });
});
