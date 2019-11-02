const net = require('net');

const HOST = '127.0.0.1';
const PORT = 1337;
const SEP = '\r\n';

const state = {
  count: 0
};

let clients = [];

const broadcast = (sender, value) => {
  clients.forEach(
    client =>
      sender !== client && client.write(SEP + '[Remote update]: ' + value + SEP)
  );
};

const httpResponse = response =>
  `HTTP/1.1 200 OK
Content-Type: text/plain
Content-length: ${response.length}

${response}
`;

const sanitize = input =>
  input
    .toString()
    .trim()
    .toLowerCase();

const executeCommand = (client, command) => {
  switch (command) {
    case 'inc':
      state.count += 1;
      broadcast(client, state.count);
      return state.count;

    case 'dec':
      state.count -= 1;
      broadcast(client, state.count);
      return state.count;

    case 'count':
      return state.count;

    default:
      return httpResponse(state.count.toString());
    // return `Unknown command: ${command}`;
  }
};

const server = net.createServer(socket => {
  clients.push(socket);

  socket.on('data', chunk => {
    const command = sanitize(chunk);
    const output = executeCommand(socket, command);

    console.log(`[${command}]`);
    socket.write('' + output);
  });

  socket.on('end', () => {
    console.log(socket.address(), 'disconnected');
    clients = clients.filter(client => client !== socket);
  });
});

server.listen(PORT, HOST, () => {
  console.log('Server listening on port', PORT);
});
