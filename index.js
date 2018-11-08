function runJsonServer(jsonServer, pathToApiStub, port, onStart) {
    let server = jsonServer.create();
    const router = jsonServer.router(pathToApiStub);
    const middlewares = jsonServer.defaults();
    server.use(middlewares);
    server.use(router);
    server = server.listen(port, () => {
        console.log('JSON Server is on');
        onStart();
    });

    return server;
}

async function runHermione(Hermione, pathToTests, hermioneOptions, hermioneConfigPath, onSuccess, onFail) {
    const hermione = new Hermione(hermioneConfigPath);
    try {
        const success = await hermione.run([pathToTests], hermioneOptions);
        console.info('Success:', success);
        if (success) onSuccess();
        else onFail();
    } catch(e) {
        console.log(e.stack);
        onFail();
    }
}

function runTests(tests, Hermione, jsonServer, options = {}) {
    let {indexTest, port, hermioneConfigPath} = options;
    if (indexTest === undefined) indexTest = 0;
    if (port === undefined) port = 3000;
    if (hermioneConfigPath === undefined) hermioneConfigPath = '.hermione.conf.js';

    if (indexTest === tests.length) return;
    const test = tests[indexTest];
    const server = runJsonServer(jsonServer, test.pathToApiStub, port, () => {
        runHermione(Hermione, test.pathToTests, test.hermioneOptions, hermioneConfigPath, () => {
            server.close(() => {
                console.log('JSON Server is off');

                runTests(tests, Hermione, jsonServer, {port, hermioneConfigPath, indexTest: indexTest + 1});
            });
        }, () => {
            server.close(() => {
                console.log('JSON Server is off');
            });
        });
    });
}

module.exports = runTests;
