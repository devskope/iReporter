[![Build Status](https://travis-ci.org/ope-oguntoye/iReporter.svg?branch=develop)](https://travis-ci.org/ope-oguntoye/iReporter)
[![codecov](https://codecov.io/gh/ope-oguntoye/iReporter/branch/develop/graph/badge.svg)](https://codecov.io/gh/ope-oguntoye/iReporter)


### Description
[**iReporter**](https://ireporter-pms.herokuapp.com/api/v1) enables any/every citizen to bring any form of corruption to the notice of appropriate authorities and the general public. Users can also report on things that need government intervention

## Features
Currently, this API provisions the following features:
 - Record creation
 - Record fetching
 - Specific Record fetching
 - Saved Record comment/location updates
 - Record deletion

## To set this project up locally
* Clone this repo and change into the directory:
 `$ git clone https://github.com/ope-oguntoye/iReporter.git && cd iReporter`

* Install the dependencies:  `npm i`

* Create .env file with environment variables in root folder:
``` gherkin
`$ echo "PORT=3000" >> .env`   // example .env
```
* Start the development server: `npm run devstart`

## Testing
* To run the tests, run `npm test`
* Manual endpoint testing can be done with [Postman](Postman | API Development Environment
https://www.getpostman.com/)


## Built with (Dependencies)
- [NodeJS](https://github.com/nodejs/node) - A JavaScript runtime environment
- [Express](https://github.com/expressjs/express) - Fast, unopinionated, minimalist web framework for node
- [Babel](https://github.com/babel/babel) - Next generation JavaScript, today (transpiler)
- [Prettier](https://github.com/babel/babel) - Prettier is an opinionated code formatter.
- [Eslint](https://github.com/eslint/eslint) - A fully pluggable tool for identifying and reporting on patterns in JavaScript
- [Mocha](https://github.com/mochajs/mocha) - Simple, flexible, fun javascript test framework for node.js & the browser
- [Chai](https://github.com/chaijs/chai) - BDD / TDD assertion framework for node.js and the browser that can be paired with any testing framework
- [Istanbul](https://github.com/istanbuljs) - Yet another JS code coverage tool that computes statement, line, function and branch coverage
