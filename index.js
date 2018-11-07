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

async function runHermione(hermione, pathToTests, hermioneOptions, onSuccess, onFail) {
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

function runTests(tests, hermione, jsonServer, indexTest = 0, port = 3000) {
    if (indexTest === tests.length) return;
    const test = tests[indexTest];
    const server = runJsonServer(jsonServer, test.pathToApiStub, port, () => {
        runHermione(hermione, test.pathToTests, test.hermioneOptions, () => {
            server.close(() => {
                console.log('JSON Server is off');

                runTests(tests, hermione, jsonServer, indexTest + 1, port);
            });
        }, () => {
            server.close(() => {
                console.log('JSON Server is off');
            });
        });
    });
}

module.export = runTests;
