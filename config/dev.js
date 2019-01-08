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

console.log('*** Running Development Stack ***');
const base = require('./default');

const config = base.config;

config.server = {
  hostname: '0.0.0.0',
  port: 8000,
};

/*
 * to run the strategic logger as a standalone script,
 * must configure database and github token within the script in the run function
 */
config.database = {
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: () => null,
  ssl: null,
};

config.github = {
  token: '', // github token used in Octokit
};

config.fallbackUser = 'nobody';

config.ldap = {
  o: '', // objectClass
  url: 'ldaps://', // ldap server url
  attributes: [],
};

config.admin = {
  posixGroup: [''], // admin posix group(s)
};

config.approver = {
  posixGroup: '', // approver posix group
};

// Users defined for dropdowns
config.display = {
  signatory: [
    'ADD A SIGNATORY', // user(s) that approve CCLAs
  ],
  poc: [
    'ADD A Point of Contact', // user(s) that are points of contacts for CCLAs
  ],
};

// Line limit for the diff checker
config.contributions = {
  autoApprove: {
    // contribution types allowed for simple contribution
    // allowed options: bugfix, feature, doc, config, test, other
    allowedTypes: ['bugfix', 'doc', 'config', 'test'],
    // contribDescTypes: used in ContribTypes for steps that require additional contributions details
    contribDescTypes: ['feature', 'other'],
    diffLimit: 100,
    newProjects: false,
  },
};

/*
 * Config for cron scheduler
 * type: onbox, crontab, none
 * cronTime: scheduler in cron pattern starting from seconds
 * timeZone: string of the timezone
 */
config.cron = {
  type: 'onbox', // runs cron-like js scheduler
  cronTime: '* * * * *', // configure cron schedule
  timeZone: 'America/Los_Angeles', // configure timezone
};

// load once asked for
function load() {
  // verify users filled out the config
  if (
    !config.display.signatory ||
    !config.display.poc ||
    config.admin.posixGroup.length === 0 ||
    !config.approver.posixGroup ||
    !config.ldap.o ||
    !config.ldap.url === 'ldaps://' ||
    !config.database.password
  ) {
    throw new Error('You have not properly filled out the config file.');
    process.exit(1);
  } else {
    return Promise.resolve(config);
  }
}

module.exports = {
  browser: config.contributions,
  config: config,
  default: config,
  load,
};
