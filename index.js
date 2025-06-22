const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.url);
  res.end('Hello from node js');
});

server.listen(3000, () => {
  console.log('Server running on port 3000')
});