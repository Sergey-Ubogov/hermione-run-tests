const runTests = require('./index');
const Hermione = require('hermione');
const jsonServer = require('json-server');

const hermione = new Hermione('.hermione.conf.js');
const tests = [
    {pathToApiStub: './api-stubs/stub1.json', pathToTests: 'hermione/tests/test1.js', updateRefs: false},
    {pathToApiStub: './api-stubs/stub2.json', pathToTests: 'hermione/tests/test2.js', updateRefs: false}
];

runTests(tests, Hermione, jsonServer);
