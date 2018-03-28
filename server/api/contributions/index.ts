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
import * as dbApprovers from '../../db/approvers';
import * as dbContribution from '../../db/contributions';
import * as dbProjects from '../../db/projects';

import { config } from '../../config';
import { RequestError } from '../../errors/index';
import { getDiffSize } from '../../util/diffcheck';

function sortContributions(list) {
  const contributionList = {};
  list.forEach(function(item) {
    if (contributionList[item.project_name]) {
      contributionList[item.project_name].push(item);
    } else {
      contributionList[item.project_name] = [];
      contributionList[item.project_name].push(item);
    }
  });
  return { contributionList };
}

export async function listContributions(req) {
  const list = await dbContribution.listContributions();
  return sortContributions(list);
}

export async function listBulkContributions(req) {
  const list = await dbContribution.listContributions();
  return list;
}

export async function listApprovalContributions(req) {
  const list = await dbContribution.listApprovalContributions();
  return list;
}

export async function getAllContributorAlias(req) {
  const list = await dbContribution.getAllContributorAlias();
  return sortContributions(list);
}

export async function listUserContributions(req, username) {
  const list = await dbContribution.listUserContributions(username);
  return sortContributions(list);
}

export async function getSingleContribution(req, id) {
  const list = await dbContribution.getSingleContribution(id);
  return list;
}

export async function approveContribution(req, body) {
  // Add check to ensure approving user has correct rights
  await dbContribution.approveContribution(
    body.contributionId,
    body.approvalNotes,
    body.approvalStatus,
  );
  return { contributionId: body.contributionId };
}

export async function addNewContribution(req, body) {
  let projectId = '';
  if (body.needsProjectReview) {
    // Since needsProjectReview is only set on a new project we can just add a project
    // TODO: toggle back to false once multiple people are submitting contributions
    const resp = await dbProjects.addProject(body.package, null, null, true); // false);
    projectId = resp.project_id;
  } else {
    projectId = body.package;
  }
  const contributionID = await dbContribution.addNewContribution(
    projectId,
    body.description,
    body.date,
    body.approver,
    body.contributor.trim(),
    body.needsProjectReview,
    body.githubLink,
  );
  return { contributionID };
}

export async function addNewAutoApprovedContribution(req, body, user) {
  const projects = await dbProjects.searchProjectById(body.projectId);
  if (projects.length !== 1 || !projects[0].project_auto_approvable) {
    throw new RequestError('Project not marked for auto-approvable contributions');
  }
  const autoApprover = await dbApprovers.getApproverByName('auto-approver');
  const contributionID = await dbContribution.addNewContribution(
    body.projectId,
    body.description,
    new Date(),
    autoApprover.approver_id,
    user,
    false,
    null,
    dbContribution.ContributionStatus.APPROVED_PENDING_LINK,
    body.meta,
  );
  return { contributionID };
}

export async function diffCheck(req, body) {
  const size = getDiffSize(body.diff);
  if (size === 0) {
    throw new RequestError('Submitted text is not a unified diff, or it had no changes');
  }
  return {
    ok: size < config.contributions.autoApprove.diffLimit,
    size,
  };
}

export async function updateContribution(req, body) {
  if (body.project_new) {
    // This is claimed to be a new project so let's find out and create if necessary
    // TODO: toggle back to false once multiple people are submitting contributions
    const resp = await dbProjects.addProject(body.project_name, null, null, true); // false);
    body.project_id = resp.project_id;
  }
  const contributionID = await dbContribution.updateContribution(
    body.project_id,
    body.contribution_id,
    body.contribution_description,
    body.contribution_date,
    body.contributor_alias.trim(),
    body.contribution_github_status,
    body.contribution_url,
    body.contribution_commit_url,
    body.approval_status,
    body.approval_notes,
    body.approval_date,
    body.contribution_submission_date,
    body.contribution_closed_date,
  );
  return { contributionID };
}

export async function updateContributionLink(req, body) {
  return await dbContribution.updateContributionLink(
    body.contrib_id,
    body.link,
  );
}
