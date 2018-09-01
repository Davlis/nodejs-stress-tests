const cluster = require('cluster');
const child_process = require('child_process');
const fs = require('fs');

const { sleep, exit } = require('./utils');
const { tests } = require('./config');

const { exec } = child_process;

if (cluster.isMaster) {
    let index = 0;

    const fork = (i) => {
        const { app, port } = tests[i];
        cluster.fork({ app, port });
    }

    fork(index);
    cluster.on('exit', () => {
        ++index;
        if (index < tests.length) {
            fork(index);
        }
    });
}

if (cluster.isWorker) {
    const { app, port } = process.env;
    
    const caseCommand = `port=${port} node ./cases/${app}`;

    console.log(caseCommand);
    const caseProcess = exec(caseCommand);

    sleep(1000).then(() => {
        const testProc = exec(`siege -c200 -t10S http://localhost:${port}`, (err, stdout, stderr) => {
            if (err) {
                console.log('Error occured: ', err.message);
                caseProcess.kill('SIGINT')
                return exit(0);
            }
    
            caseProcess.kill('SIGINT');
            exit(0);
        });
    
        const writeStream = fs.createWriteStream(`./cases/${app}/${app.toUpperCase()}.MD`);
        testProc.stdout.pipe(writeStream);
        testProc.stderr.pipe(writeStream);
    });
}
