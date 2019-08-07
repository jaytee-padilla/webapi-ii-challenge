// setup express
const express = require('express');
const server = express();

// setup api server
server.use(express.json());
server.get('/', (request, response) => response.send('\nAPI running\n'))
server.listen(8000, () => console.log('\nAPI running on port 8000\n'));

// routing
const routes = require('./routes/api');
server.use('/api', routes);