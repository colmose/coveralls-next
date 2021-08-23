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
      const params = new URLSearchParams();
      params.append('json', JSON.stringify(object));
      const response = await fetch(url, {
        method: 'post',
        body: params,
        headers: {'Content-Type': 'application/json'},
      });

      if (!response.ok) {
        cb(`unexpected response ${response.statusText}`);
      }

      cb(null, response);
    } catch (error) {
      cb(error);
    }
  }
};

module.exports = sendToCoveralls;
