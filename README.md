# hermione-run-tests
Run tests for each stub api consistently

# Install
```code bash
npm install --save-dev hermione-run-tests
```
# Usage
  for example you have a .hermione.conf.js like this:

```code javascript
module.exports = {
    baseUrl: 'http://localhost',
    gridUrl: 'http://localhost:4444/wd/hub',

    browsers: {
        'chrome': {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        }
    },

    plugins: {
        'html-reporter/hermione': {
            path: 'hermione/screens'
        }
    },
    screenshotsDir: 'hermione/screens/images'
};
```
and yoy have two tests
/tests/test1.js
```code javascript
describe('test1', function() {
    it('rub to dollar', function() {
        return this.browser
            .url('/')
            .waitForVisible('.selector', 3000)
            .assertView('converter is visible', '.selector')
    });
});
```
and /tests/test2.js
```code javascript
describe('test2', function() {
    it('euro to dollar', function() {
        return this.browser
            .url('/')
            .waitForVisible('.selector', 3000)
            .assertView('converter is visible', '.selector')
    });
});
```

and let's imagine that each test needs its own API:
/api-stub/stub1.json
```code json
{
	"stub": {
		"payload": "1"
	}
}
```
/api-stub/stub2.json
```code json
{
	"stub": {
		"payload": "2"
	}
}
you want to run every test for your API-stub.
just create the following file:
autorun-tests.js
```code javascript
const runTests = require('hermione-run-tests');
const Hermione = require('hermione');
const jsonServer = require('json-server');

const tests = [
    {pathToApiStub: './api-stubs/stub1.json', pathToTests: 'hermione/tests/test1.js', updateRefs: false},
    {pathToApiStub: './api-stubs/stub2.json', pathToTests: 'hermione/tests/test2.js', updateRefs: false}
];

runTests(tests, Hermione, jsonServer);
```
and by running the command ```node autorun-tests.js``` your tests will run alternately:

