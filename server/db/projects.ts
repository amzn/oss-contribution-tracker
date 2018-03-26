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

// tslint:disable:variable-name

// List all projects
export function listProjects() {
  return pg().query('select * from projects');
}

// List the projects that have had their project verified
export function listApprovalProjects() {
  return pg().query('select * from projects where project_verified = false order by project_name');
}

// Select project by an ID
export function searchProjectById(id) {
  return pg().query('select * from projects where project_id = $1', [id]);
}

// Select project by name
export async function searchProjectByName(name) {
  return await pg().oneOrNone('select project_id from projects where project_name = $1', [name]);
}

// Add a new project to the DB
export async function addProject(name, contribUrl, license, verified) {
  // Check if project already exists and add if it doesn't
  const check = pg().oneOrNone('select project_id from projects where project_name = $1', [name]);
  if (check) {
    return pg().one(
      'insert into projects (project_name, project_url, project_license, ' +
      'project_verified) values ($1, $2, $3, $4) returning project_id',
      [name, contribUrl, license, verified],
    );
  }
}
