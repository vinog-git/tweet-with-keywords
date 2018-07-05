require('./config');
const handleRequests = require('./src/scripts/handle-request');
let PORT = process.env.PORT || 3000;
const server = require('http').createServer();
server.listen(PORT, () => console.log(`Server bound on ${PORT}`));

process.stdin.resume();
process.stdin.on("data", function (data) {
    handleRequests(data.toString());
});