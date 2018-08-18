require('./config');
const handleRequests = require('./src/scripts/handle-request');
let PORT = process.env.PORT || 3000;
const http = require('http');
http.createServer((req, res) => {
    let response = {
        data: ''
    };
    if (req.url === '/api/v1/tweet' && req.headers.v_key === process.env.v_key) {
        let body = [];
        req.on('error', err => {
            console.log(err);
            response.data = 'Error';
            res.end(JSON.stringify(response));

        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            // at this point, `body` has the entire request body stored in it as a string
            response.data = 'Successfully received data';
            response = {
                data: body
            };
            handleRequests(body);
            res.end(JSON.stringify(response));
        });
    }


}).listen(PORT, () => console.log(`Server bound on ${PORT}`));

process.stdin.resume();
process.stdin.on("data", function (data) {
    handleRequests(data.toString());
});