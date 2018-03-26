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

// List of CLA's
export function getClaTable() {
  return pg().query('select * from cla order by project_id asc');
}

// List of project_names of the html5 datalist
export function getClaProjectNames() {
  return pg().query('select distinct project_name from cla order by project_name asc');
}

// Add a new cla to the DB
export async function pushNewCla(project_name, signatory_name, approver_name, contact_name, date_signed, date_approved, ticket_link, contributor_names, additional_notes) {
  return await pg().none(
    'insert into cla (project_name, signatory_name, approver_name, contact_name, date_signed, date_approved, ticket_link, contributor_name, additional_notes, external_view_link) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [project_name, signatory_name, approver_name, contact_name, date_signed, date_approved, ticket_link, contributor_names, additional_notes, null],
  );
}

// Get project via project_id
export async function getSingleCla(projetId) {
  return await pg().query('select * from cla where project_id = $1', [projetId]);
}

// Delete query for edit page
export async function deleteSingleCla(projectId) {
  return await pg().none('delete from cla where project_id = $1', [projectId]);
}

// Update query
export async function updateSingleCla(project_name, signatory_name, approver_name, contact_name, date_signed, date_approved, ticket_link, contributor_names, additional_notes, project_id) {
  return await pg().none('update cla set project_name = $1, signatory_name = $2, approver_name = $3, contact_name = $4, date_signed = $5, date_approved = $6, ticket_link = $7, contributor_name = $8, additional_notes = $9 where project_id = $10',
    [project_name, signatory_name, approver_name, contact_name, date_signed, date_approved, ticket_link, contributor_names, additional_notes, project_id]);
}
