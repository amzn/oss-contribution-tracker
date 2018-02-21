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

// List contributions that don't require project approval
export function listContributions() {
   return pg().query('select C.contribution_id, P.project_id, lower(P.project_name) as project_name, C.project_id, C.contribution_description, C.contribution_github_status, C.contribution_url, C.contribution_commit_url, C.approval_status, C.contribution_submission_date, C.contributor_alias from projects P, contributions C where P.project_id = C.project_id order by P.project_id');
}

// List all contributions that require project approval
export function listApprovalContributions() {
   return pg().query('select C.contribution_id, P.project_id, lower(P.project_name) as project_name, C.project_id, C.contribution_description, C.contribution_github_status, C.contribution_url, C.contribution_commit_url, C.approval_status, C.contribution_submission_date, C.contributor_alias from projects P, contributions C where P.project_id = C.project_id and C.approval_status = \'pending\' order by contribution_submission_date asc');
}
// List of all the employee alias
export async function getAllContributorAlias() {
  return await pg().query('select C.contributor_alias as alias from projects P, contributions C where P.project_id = C.project_id order by P.project_id ASC');
}

// List contributions by a specific user
export function listUserContributions(username) {
   return pg().query('select P.project_id, lower(P.project_name) as project_name, C.contribution_id, C.project_id, C.contribution_description, C.contribution_github_status, C.contribution_url, C.contribution_commit_url, C.approval_status, C.contribution_submission_date from projects P, contributions C where P.project_id = C.project_id and C.contributor_alias = $1 order by P.project_id', [username]);
}

// Get single contribution by id
export function getSingleContribution(id) {
   return pg().query('select P.project_id, lower(P.project_name) as project_name, C.project_id, C.contribution_id, C.contribution_description, C.contribution_date, C.contributor_alias, C.contribution_github_status, C.contribution_url, C.contribution_commit_url, C.approver_id, C.approval_status, C.approval_notes, C.approval_date, C.contribution_submission_date, C.contribution_closed_date, C.contribution_project_review from projects P, contributions C where P.project_id = C.project_id and C.contribution_id = $1', [id],
   );
}

// Add a new contribution to the DB
export async function addNewContribution(project_id, description, contribution_date, approver, contributor_alias, contribution_project_review, githublink) {
  return await pg().none( // fill out all fields as it was easier
    'insert into contributions (project_id, contribution_description, contribution_date, contributor_alias, contribution_github_status, contribution_commit_url, approver_id, approval_status, approval_notes, approval_date, contribution_submission_date, contribution_closed_date, contribution_project_review) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
    [project_id, description, contribution_date, contributor_alias, 'pending', githublink, approver, 'pending', null, null, contribution_date, null, contribution_project_review],
  );
}

// Auto approval for simple contributions
export async function addNewContributionApproved(project_id, description, contribution_date, approver, contributor_alias, contribution_project_review, githublink, approvalNotes) {
  return await pg().none( // fill out all fields as it was easier
    'insert into contributions (project_id, contribution_description, contribution_date, contributor_alias, contribution_github_status, contribution_commit_url, approver_id, approval_status, approval_notes, approval_date, contribution_submission_date, contribution_closed_date, contribution_project_review) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
    [project_id, description, contribution_date, contributor_alias, 'pending', githublink, 4, 'approved', approvalNotes, null, contribution_date, null, contribution_project_review],
  );
}

// Update approval column of a specific contribution
export async function approveContribution(id, notes, status) {
  return await pg().none(
    'update contributions set approval_status = $1, approval_notes = $2 where contribution_id = $3',
    [status, notes, id],
  );
}

export async function updateContribution(project_id, contribution_id, contribution_description, contribution_date, contributor_alias, contribution_github_status, contribution_url, contribution_commit_url, approval_status, approval_notes, approval_date, contribution_submission_date, contribution_closed_date) {
  return await pg().none( // fill out all fields as it was easier
    'update contributions set (project_id, contribution_description, contribution_date, contributor_alias, contribution_github_status, contribution_url, contribution_commit_url, approval_status, approval_notes, approval_date, contribution_submission_date, contribution_closed_date) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) where contribution_id = $13',
    [project_id, contribution_description, contribution_date, contributor_alias, contribution_github_status, contribution_url, contribution_commit_url, approval_status, approval_notes, approval_date, contribution_submission_date, contribution_closed_date, contribution_id],
  );
}

export async function updateContributionLink(contrib_id, link) {
  return await pg().none('update contributions set (contribution_commit_url) = ($1) where contribution_id = $2', [link, contrib_id]);
}