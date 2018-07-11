/* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
import 'source-map-support/register';

import * as compression from 'compression';
import { CronJob } from 'cron';
import * as express from 'express';
import * as fs from 'fs';
import * as winston from 'winston';

import { router as apiRoutes } from './api/routes';
import { config, load } from './config';
import pg, { connect } from './db';
import { onboxRun as runStrategic } from './util/strategicLogger';
// const octokit = require('@octokit/rest')();

// install a crash handler to log errors
process.on('uncaughtException', err => {
  winston.error('FATAL exception: ' + err);
  winston.error(err.stack);
  process.exit(99);
});

// let's get this junker running
const app = express();

// allow disabling CSP for local/dev server
let cspEnabled = true;
export function disableCSP() {
  winston.warn('Disabling Content-Security-Policy');
  cspEnabled = false;
}

if (cspEnabled) {
  // apply a security policy for general scripts.
  // webpack uses eval() for cheap source maps, so don't enable during development.
  // don't use it with selenium, either, since it needs eval() to do a bunch of things.
  app.use((req, res, next) => {
    if (cspEnabled) {
      res.set('Content-Security-Policy', "script-src 'self';");
    }
    return next();
  });
}

app.use('/api', apiRoutes);
app.use(compression());
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/res', express.static(__dirname + '/../res'));

app.use('/', (req, res) => {
  res.sendFile(__dirname + '/assets/template.html');
});

/**
 * Load app configuration, initialize, and listen.
 */
export let start = async function(port, hostname) {
  winston.info('Starting up...');

  // wait for configuration to resolve
  try {
    await load();
  } catch (ex) {
    winston.error(ex);
    throw ex;
  }

  // connect to postgresql
  connect({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    ssl: config.database.ssl,
  });

  winston.info('Configuration ready; launching HTTP server');

  if (config.cron.type === 'onbox') {
    // run cron-like scheduler
    const strategicUpdater = new CronJob(config.cron.cronTime, () => { runStrategic(config, pg()) }, false, config.cron.timeZone);
    strategicUpdater.start();
  } else {
    // output crontab execution file
    fs.writeFile('strategicScheduler', config.cron.cronTime + ' /server/util/strategicLogger.js', (err) => {
      if (err) { throw err; }
      console.log('*******************************************************************************************');
      console.log('Cron script, strategicScheduler, has been created in the root directory for standalone use!');
      console.log('*******************************************************************************************');
    });
  }

  // go!
  app.listen(port, hostname);
};

export default app;
