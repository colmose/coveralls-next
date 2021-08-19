'use strict';

const logger = require('./logger')();
const index = require('..');
const fs = require('fs');

function handleInput(input, cb, userOptions) {
  logger.debug(input);
  logger.debug(`user options ${userOptions}`);
  index.getOptions((err, options) => {
    if (err) {
      logger.error('error from getOptions');
      cb(err);
      return;
    }

    logger.debug(options);

    index.convertLcovToCoveralls(input, options, (err, postData) => {
      if (err) {
        logger.error('error from convertLcovToCoveralls');
        cb(err);
        return;
      }
      try {
      fs.writeFileSync('/home/jenkins/agent/workspace/PR-investigate_PR-14678/coveralls.log', JSON.stringify(postData))
      } catch(e) {
        logger.error('Unable to write postData to log file')
        logger.error(e)
      }
      logger.info(' *****************  sending this to coveralls.io: ********************\n', JSON.stringify(postData, null, 2));
      index.sendToCoveralls(postData, (err, response) => {
        if (err) {
          const errorBody = await err.response.text();
          logger.debug(errorBody);
          cb(err);
          return;
        }

        logger.debug(response);

        if (!response.ok) {
          cb(`Bad response: ${response.statusCode} ${response.body}`);
          return;
        }

        cb(null, response.body);
      });
    });
  }, userOptions);
}

module.exports = handleInput;
