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

export enum ContributionStatus {
  PENDING = 'pending',
  DENIED = 'denied',
  APPROVED_PENDING_LINK = 'approved-pending-link',
  APPROVED_UPSTREAM_PENDING = 'approved-upstream-pending',
  APPROVED_UPSTREAM_ACCEPTED = 'approved-upstream-accepted',
  APPROVED_UPSTREAM_REJECTED = 'approved-upstream-rejected',
}

// List contributions that don't require project approval
export function listContributions() {
  return pg().query(
    'select C.contribution_id, P.project_id, ' +
      'lower(P.project_name) as project_name, C.project_id, C.contribution_description, ' +
      'C.contribution_github_status, C.contribution_url, C.approval_status, ' +
      'C.contribution_submission_date, C.contributor_alias from projects P, contributions C ' +
      'where P.project_id = C.project_id order by P.project_id'
  );
}

// List all contributions that require project approval
export function listApprovalContributions() {
  return pg().query(
    'select C.contribution_id, P.project_id, lower(P.project_name) as project_name, ' +
      'C.project_id, C.contribution_description, C.contribution_github_status, C.contribution_url, ' +
      'C.approval_status, C.contribution_submission_date, C.contributor_alias ' +
      'from projects P, contributions C where P.project_id = C.project_id and ' +
      "C.approval_status = 'pending' order by contribution_submission_date asc"
  );
}
// List of all the employee alias
export async function getAllContributorAlias() {
  return await pg().query(
    'select C.contributor_alias as alias from projects P, contributions C ' +
      'where P.project_id = C.project_id order by P.project_id ASC'
  );
}

// List contributions by a specific user
export function listUserContributions(username) {
  return pg().query(
    'select P.project_id, lower(P.project_name) as project_name, ' +
      'C.contribution_id, C.project_id, C.contribution_description, ' +
      'C.contribution_github_status, C.contribution_url,C.approval_status, ' +
      'C.contribution_submission_date from projects P, contributions C where ' +
      'P.project_id = C.project_id and C.contributor_alias = $1 order by P.project_id',
    [username]
  );
}

// Get single contribution by id
export function getSingleContribution(id) {
  return pg().query(
    'select P.project_id, lower(P.project_name) as project_name, C.project_id, ' +
      'C.contribution_id, C.contribution_description, C.contribution_date, C.contributor_alias, ' +
      'C.contribution_github_status, C.contribution_url, C.approver_id, ' +
      'C.approval_status, C.approval_notes, C.approval_date, C.contribution_submission_date, ' +
      'C.contribution_closed_date, C.contribution_project_review from projects P, contributions C ' +
      'where P.project_id = C.project_id and C.contribution_id = $1',
    [id]
  );
}

// List all strategic contributions
export function listStrategicContributions() {
  return pg().query(
    'select * from contributions where approval_status = "approved-strategic"'
  );
}

// Add strategic contribution

// Add a new contribution to the DB
export async function addNewContribution(
  project_id,
  description,
  contribution_date,
  approver,
  contributor_alias,
  contribution_project_review,
  githublink,
  approval_status = ContributionStatus.PENDING,
  metadata = null
) {
  return await pg().none(
    // fill out all fields as it was easier
    'insert into contributions (project_id, contribution_description, contribution_date, ' +
      'contributor_alias, contribution_github_status, contribution_url, approver_id, ' +
      'approval_status, approval_notes, approval_date, contribution_submission_date, ' +
      'contribution_closed_date, contribution_project_review, contribution_metadata) ' +
      'values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14:json)',
    [
      project_id,
      description,
      contribution_date,
      contributor_alias,
      'pending',
      githublink,
      approver,
      approval_status,
      null,
      null,
      contribution_date,
      null,
      contribution_project_review,
      metadata,
    ]
  );
}

// Update approval column of a specific contribution
export async function approveContribution(id, notes, status) {
  return await pg().none(
    'update contributions set approval_status = $1, approval_notes = $2 where contribution_id = $3',
    [status, notes, id]
  );
}

export async function updateContribution(
  project_id,
  contribution_id,
  contribution_description,
  contribution_date,
  contributor_alias,
  contribution_github_status,
  contribution_url,
  approval_status,
  approval_notes,
  approval_date,
  contribution_submission_date,
  contribution_closed_date
) {
  return await pg().none(
    // fill out all fields as it was easier
    'update contributions set (project_id, contribution_description, contribution_date, ' +
      'contributor_alias, contribution_github_status, contribution_url, ' +
      'approval_status, approval_notes, approval_date, contribution_submission_date, ' +
      'contribution_closed_date) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) where contribution_id = $12',
    [
      project_id,
      contribution_description,
      contribution_date,
      contributor_alias,
      contribution_github_status,
      contribution_url,
      approval_status,
      approval_notes,
      approval_date,
      contribution_submission_date,
      contribution_closed_date,
      contribution_id,
    ]
  );
}

export async function updateContributionLink(contrib_id, link) {
  return await pg().none(
    'update contributions set (contribution_url, approval_status) = ($1, $2) where contribution_id = $3',
    [link, ContributionStatus.APPROVED_UPSTREAM_PENDING, contrib_id]
  );
}

export async function getLastWeekCount(ids, users) {
  return await pg().oneOrNone(
    'select count(*) as numContribs from contributions ' +
      'WHERE contribution_date BETWEEN ' +
      'NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 ' +
      'AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER AND project_id=ANY($1) AND approval_status=$2 AND contributor_alias=ANY($3)',
    [ids, 'approved-strategic', users]
  );
}

export async function getMTDCount(ids, users) {
  return await pg().oneOrNone(
    'select count(*) as numContribs from contributions ' +
      'WHERE (contribution_date BETWEEN ' +
      '(NOW()::DATE-EXTRACT(DAY FROM NOW())::INTEGER + 1)::DATE ' +
      'AND NOW()::DATE) AND project_id=ANY($1) AND approval_status=$2 AND contributor_alias=ANY($3)',
    [ids, 'approved-strategic', users]
  );
}

export async function getLastMonthCount(ids, users) {
  return await pg().oneOrNone(
    'select count(*) as numContribs from contributions ' +
      'WHERE (contribution_date BETWEEN ' +
      '(NOW()::DATE-EXTRACT(DAY FROM NOW())::INTEGER + 1 - INTERVAL $1)::DATE ' +
      'AND (NOW()::DATE-EXTRACT(DAY FROM NOW())::INTEGER)::DATE) AND project_id=ANY($2) AND approval_status=$3 AND contributor_alias=ANY($4)',
    ['1 MONTH', ids, 'approved-strategic', users]
  );
}

export async function getYTDCount(ids, users) {
  return await pg().oneOrNone(
    'select count(*) as numContribs from contributions ' +
      'WHERE (contribution_date BETWEEN ' +
      "DATE_TRUNC('year', now()) AND now() " +
      'AND project_id=ANY($1) AND approval_status=$2 AND contributor_alias=ANY($3))',
    [ids, 'approved-strategic', users]
  );
}

export async function listStrategicContributionsByGroup(projects, users) {
  return await pg().query(
    'select * from contributions where project_id=ANY($1) ' +
      "and contributor_alias=ANY($2) and approval_status='approved-strategic' " +
      'order by contribution_date desc',
    [projects, users]
  );
}

export async function listStrategicContributionsByProject(id) {
  return await pg().query(
    'select * from contributions where project_id=$1 ' +
      "and approval_status='approved-strategic' " +
      'order by contribution_date desc',
    [id]
  );
}

export async function monthlyStrategicContributionsByProject(id, users, date) {
  const month = date.slice(5, 7);
  const year = date.slice(0, 4);

  return await pg().query(
    'select * from contributions where project_id = $1 ' +
      "and approval_status='approved-strategic' " +
      'and EXTRACT(MONTH from contribution_date) = $2 ' +
      'and EXTRACT(YEAR from contribution_date) = $3 ' +
      'and contributor_alias=ANY($4) ' +
      'order by contribution_date desc',
    [id, month, year, users]
  );
}

export async function monthlyTotalByProject(id, date) {
  const month = date.slice(5, 7);
  const year = date.slice(0, 4);

  return await pg().oneOrNone(
    'select count(*) as total from contributions ' +
      'where project_id = $1 and EXTRACT(MONTH from contribution_date) = $2 ' +
      'and EXTRACT(YEAR from contribution_date) = $3',
    [id, month, year]
  );
}

export async function monthlyTotalByUser(projectIds, user, date) {
  const month = date.slice(5, 7);
  const year = date.slice(0, 4);

  return await pg().oneOrNone(
    'select count(*) as total from contributions ' +
      'where project_id =ANY($1) and EXTRACT(MONTH from contribution_date) = $2 ' +
      'and EXTRACT(YEAR from contribution_date) = $3 and contributor_alias = $4',
    [projectIds, month, year, user]
  );
}

export async function oldestContributionYear() {
  return await pg().oneOrNone(
    'select extract(year from min(contribution_date)) as year from contributions'
  );
}
