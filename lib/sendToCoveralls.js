'use strict';

const fetch = require('node-fetch');
const index = require('..');

const sendToCoveralls = async (object, cb) => {
  let urlBase = 'https://coveralls.io';
  if (process.env.COVERALLS_ENDPOINT) {
    urlBase = process.env.COVERALLS_ENDPOINT;
  }

  const url = `${urlBase}/api/v1/jobs`;

  if (index.options.stdout) {
    process.stdout.write(JSON.stringify(object));
    cb(null, {statusCode: 200});
  } else {
    try {
      const response = await fetch(url, {
        method: "post",
        body: JSON.stringify(object),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      cb(null, data)
    } catch(e) {
      cb(e);
    }
  }


};

module.exports = sendToCoveralls;
