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
import pg from './index';

// List all users
export function listAllUsers() {
  return pg().query('select * from users');
}

export function searchUserByGithub(alias) {
  return pg().oneOrNone('select * from users where github_alias = $1', [alias]);
}

export function listGroupsByGithub(alias) {
  return pg().oneOrNone(
    'select array(select jsonb_object_keys(groups)::int) as groups from users where github_alias = $1',
    [alias]
  );
}

export function getUsersByGroup(groupId) {
  return pg().query('select * from users WHERE groups->>$1 IS NOT NULL', [
    groupId,
  ]);
}

export function getUsernamesByGroup(groups) {
  return pg().oneOrNone(
    'select array_agg(c) as names ' +
      'from (' +
      'select amazon_alias from users where groups ?| $1' +
      ') as dt(c)',
    [groups]
  );
}

// Add a new user to the DB
export async function addNewUser(amazonAlias, githubAlias, groups) {
  const check = await pg().oneOrNone(
    'select amazon_alias from users where amazon_alias = $1',
    [amazonAlias]
  );
  if (!check) {
    return await pg().none(
      'insert into users (amazon_alias, github_alias, groups) ' +
        'values ($1, $2, $3)',
      [amazonAlias, githubAlias, groups]
    );
  }
  return 'exists';
}

// Add groups to a user
export async function addGroupsToUser(amazonAlias, groups) {
  return await pg().none(
    'update users set groups = groups || $1 where amazon_alias = $2',
    [groups, amazonAlias]
  );
}

// Remove groups from a user
export async function removeGroupFromUser(amazonAlias, group) {
  return await pg().none(
    "update users set groups = groups - '$1' where amazon_alias = $2",
    [group, amazonAlias]
  );
}
