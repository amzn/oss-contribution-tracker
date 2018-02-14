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

config.database = {
  host: 'contributionlogger.cjvrtnhhdzyg.us-west-2.rds.amazonaws.com',
  port: 8200,
  database: 'contributionlogger',
  user: 'cl',
  password: 'n5wIDCynCAA8',
  ssl: null,
};

config.fallbackUser = 'nobody';

config.ldap = {
  o: 'amazon.com', // objectClass
  url: 'ldaps://ldap.amazon.com:636', // ldap server url
  attributes: ['gecos','amzndeptname','amzncity','mail', 'description', 'roomnumber'],
};

config.admin = {
  posixGroup: ['osa'], // admin posix group(s)
};

config.approver = {
  posixGroup: 'osa', // approver posix group
};

// Users defined for dropdowns
config.display = {
  signatory: [
    'jmowers', // user(s) that approve CCLAs
  ],
  poc: [
    'hyandell', // user(s) that are points of contacts for CCLAs
  ],
};

module.exports = {
  default: config,
  config: config,
  load: base.load,
};