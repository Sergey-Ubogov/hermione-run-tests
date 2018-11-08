async function runJsonServer(jsonServer, pathToApiStub, port) {
    let server = jsonServer.create();
    const router = jsonServer.router(pathToApiStub);
    const middlewares = jsonServer.defaults();
    server.use(middlewares);
    server.use(router);
    server = await server.listen(port);

    console.log(`JSON Server started on ${port} port`);

    return server;
}

async function runHermione(Hermione, testPaths, hermioneOptions, hermioneConfigPath) {
    const hermione = new Hermione(hermioneConfigPath);
    try {
        const testPassed = await hermione.run(testPaths, hermioneOptions);
        console.info(`${testPaths} passed:`, testPassed);
        return testPassed;
    } catch(e) {
        console.log(e.stack);
        return 0;
    }
}

async function runTests(tests, Hermione, jsonServer, options = {}) {
    let {port, hermioneConfigPath, hermioneOptions, countRetry} = options;
    if (port === undefined) port = 3000;
    if (countRetry === undefined) countRetry = 1;
    if (hermioneConfigPath === undefined) hermioneConfigPath = '.hermione.conf.js';

    for (let indexTest = 0; indexTest < tests.length; indexTest++) {
    	const test = tests[indexTest];
    	let testCountRetry = test.countRetry || countRetry;
		let testPassed = false;

    	while (testCountRetry--) {
			const server = await runJsonServer(jsonServer, test.pathToApiStub, port);

			testPassed = await runHermione(Hermione, test.testPaths, test.hermioneOptions || hermioneOptions, hermioneConfigPath);
			server.close(() => console.log('JSON Server is off'));

			if (testPassed) break;
		}
		if (!testPassed) break;
	}
}

module.exports = runTests;
