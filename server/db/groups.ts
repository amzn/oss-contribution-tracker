/* Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

// List all strategic groups
export function listGroups() {
  return pg().query('select * from groups');
}

export function searchGroupIdsByProjectId(id) {
  return pg().oneOrNone(
    'select array_agg(c) as groups from (select group_id::text from groups where projects @> array[$1]::int[]) as dt(c)',
    [id]
  );
}

export function getGroupsByProjectId(id) {
  return pg().query(
    'select * from groups ' +
      'where group_id = ANY(ARRAY(' +
      'select array_agg(c) as groups ' +
      'from (select group_id from groups where projects @> $1::int[]) ' +
      'as dt(c)' +
      '))',
    [id]
  );
}

export function getGroupById(id) {
  return pg().oneOrNone('select * from groups where group_id=$1', [id]);
}

// Add a new group to the DB
export async function addNewGroup(name, sponsor, goals, projects) {
  return await pg().oneOrNone(
    'insert into groups (group_name, sponsor, goal, projects) ' +
      'values ($1, $2, $3, $4) returning group_id',
    [name, sponsor, goals, projects]
  );
}

// Add projects to a group
export async function addProjectToGroup(id, groupName, projects) {
  return await pg().none(
    'update groups set group_name=$1, projects = projects || $2 ' +
      'where group_id=$3',
    [groupName, projects, id]
  );
}

// Update a group
export async function updateGroup(id, name, sponsor, goal, projects) {
  return await pg().none(
    'update groups set group_name=$1, sponsor=$2, goal=$3, projects=$4 ' +
      'where group_id=$5',
    [name, sponsor, goal, projects, id]
  );
}

// Delete group by id
export async function deleteGroup(id) {
  return await pg().none('delete from groups where group_id=$1', [id]);
}
