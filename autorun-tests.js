const runTests = require('./index');
const Hermione = require('hermione');
const jsonServer = require('json-server');

const tests = [
    {pathToApiStub: './api-stubs/stub1.json', testPaths: ['hermione/tests/test1.js', 'hermione/tests/test2.js']},
    {pathToApiStub: './api-stubs/stub2.json', testPaths: 'hermione/tests/test2.js'}
];

runTests(tests, Hermione, jsonServer, {countRetry: 2});
