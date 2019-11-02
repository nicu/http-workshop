const http = require('http');
const fs = require('fs');
const path = require('path');
const cookie = require('cookie');

const proxy = http.createServer();

const cache = {};

const serverPorts = [3001, 3002];

const random = max => Math.floor(Math.random() * max);

proxy.on('request', (clientRequest, clientResponse) => {
  const cacheKey = (clientRequest.method + clientRequest.url).replace(
    /[^a-zA-Z0-9]+/g,
    '_'
  );
  console.log('[proxy]', cacheKey);

  const filename = path.resolve(__dirname, 'cache', cacheKey);

  const cookies = cookie.parse(clientRequest.headers.cookie);

  // if there is no cookie or port in the cookie, choose a random port
  const randomPort = serverPorts[random(serverPorts.length)];
  const targetPort = cookies.server || randomPort;

  console.log(cache[cacheKey]);

  if (cache[cacheKey]) {
    const cacheFile = fs.createReadStream(cache[cacheKey].filename);
    clientResponse.writeHead(200, cache[cacheKey].headers);
    cacheFile.pipe(clientResponse);
    return;
  }

  // no cached version
  const params = {
    host: 'localhost',
    port: targetPort,
    path: clientRequest.url,
    method: clientRequest.method,
    header: clientRequest.headers
  };

  const handler = serverResponse => {
    clientResponse.writeHead(serverResponse.statusCode, serverResponse.headers);
    serverResponse.pipe(clientResponse);

    if (clientRequest.method === 'GET') {
      const cacheFile = fs.createWriteStream(filename);
      serverResponse.pipe(cacheFile);

      cache[cacheKey] = { filename, headers: serverResponse.headers };
    }
  };

  const proxyRequest = http.request(params, handler);
  clientRequest.pipe(proxyRequest);
});

const listener = proxy.listen(8080, () =>
  console.log('Server listening on port', listener.address().port)
);
