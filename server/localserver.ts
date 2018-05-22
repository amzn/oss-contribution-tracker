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
import winston = require('winston');

winston.level = 'debug';

if (process.env.DOMAIN == null) {
  process.env.DOMAIN = 'alpha';
} else if (process.env.DOMAIN === 'prod') {
  throw new Error('refusing to run dev server as production');
}

// use require() instead of import to set env beforehand
// tslint:disable-next-line:no-var-requires
const config = require('./config').default;
// tslint:disable-next-line:no-var-requires
const app = require('./app');

app.disableCSP();
app
  .start(config.server.port, config.server.hostname)
  .then(() => {
    // we have to set configuration after startup has completed;
    // some is deferred and won't resolve immediately

    // since sentry isn't used here, simulate a user
    // do *not* use in prod
    config.fallbackUser = process.env.DEBUG_USER || process.env.USER;
    winston.info(`Sessions will launch as "${config.fallbackUser}"`);

    winston.info(
      `Server running [${process.env.NODE_ENV}/${
        process.env.DOMAIN
      }]: http://0.0.0.0:${config.server.port}/`
    );
  })
  .catch(err => winston.error(err));
