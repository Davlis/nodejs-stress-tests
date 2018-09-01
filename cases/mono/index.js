const http = require('http');

const pid = process.pid;

const TEN_MILIONS = 1e7;

const server = http.createServer((req, res) => {
    for (let i = TEN_MILIONS;  i > 0; --i) {
        // NOOP
    }
    //console.log(`Handling request from ${pid}`);
    res.end(`Hello from ${pid}\n`);
});

server.listen(process.env.port || 8080, () => {
    console.log(process.env.port);
    console.log(`Started server ${pid}`);
});
