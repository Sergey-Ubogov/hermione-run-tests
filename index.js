function runJsonServer(jsonServer, pathToApiStub, onStart) {
    let server = jsonServer.create();
    const router = jsonServer.router(pathToApiStub);
    const middlewares = jsonServer.defaults();
    server.use(middlewares);
    server.use(router);
    server = server.listen(3000, () => {
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

function runTests(tests, hermione, jsonServer, indexTest = 0) {
    if (indexTest === tests.length) return;
    const test = tests[indexTest];
    const server = runJsonServer(jsonServer, test.pathToApiStub, () => {
        runHermione(hermione, test.pathToTests, test.hermioneOprions, () => {
            server.close(() => {
                console.log('JSON Server is off');

                runTests(tests, indexTest + 1);
            });
        }, () => {
            server.close(() => {
                console.log('JSON Server is off');
            });
        });
    });
}

module.export = runTests;
