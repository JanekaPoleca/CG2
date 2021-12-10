let express = require('express');
let path = require("path");
let server = express();
let path2 = path.join(process.cwd(), 'public');
console.log(path2);
server.use(express.static(path2));
server.listen(3000);