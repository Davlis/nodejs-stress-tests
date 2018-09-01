const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const cpus = os.cpus().length;
    console.log(`Clustering to ${cpus} CPUs`);

    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code) => {
        console.log('exit');
        if (code !== 0 && !worker.suicide) {
            cluster.fork();
        }
    });
}

if (cluster.isWorker) {
    require('../mono');
    setTimeout(() => {
        throw new Error('Ooops');
      }, Math.ceil(Math.random() * 3) * 1000);
}
