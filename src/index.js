const express = require('express')
const path = require("path")

// Create Server
const server = express()

server.use(express.static(path.join(process.cwd(), 'public'), {index: ['index.html', 'index.js'], extensions:['js', 'module.js']}));

server.listen(3000);