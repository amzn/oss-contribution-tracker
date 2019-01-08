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

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as winston from 'winston';

import LDAP from '../auth/ldap';
import config from '../config';

import { AccessError } from '../errors';
import * as approversAPI from './approvers';
import * as claAPI from './cla';
import * as contributionsAPI from './contributions';
import * as metricsAPI from './metrics';
import * as projectsAPI from './projects';
import * as groupsAPI from './strategicgroups';

export let router = express.Router();

router.use(bodyParser.json({ limit: '1000kb' }));
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/**
 * Forces all requests to grab the requesting users access privileges so
 * all actions can be checked against those privileges
 */
router.use(checkAccess);

router.get('/user', async (req, res, next) => {
  // check for midway id token in req
  const user = await getUser(req);
  const groups = await LDAP.getGroups(user);
  const roles = await getRoles(groups);
  res.send({
    user,
    groups,
    roles: Array.from(roles),
    access: (req as any).UserAccess,
  });
});

router.get('/config/display', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    // return users defined in server config
    res.send(config.display);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /config/display`);
    res.status(403);
    res.send({
      error: 'You do not posses the permissions to access that',
    });
  }
});

router.get('/metrics/contrib/user/counts', (req, res, next) => {
  pack(metricsAPI.usersAndCounts(req), res, next);
});

router.get('/metrics/contrib/counts/year/all', (req, res, next) => {
  pack(metricsAPI.contribCountByYearAll(req), res, next);
});

router.get('/metrics/contrib/counts/year/:year', (req, res, next) => {
  pack(metricsAPI.contribCountByYear(req, req.params.year), res, next);
});

router.get('/metrics/contrib/projects/counts/all', (req, res, next) => {
  pack(metricsAPI.topContribProjectsAllTime(req), res, next);
});

router.get('/metrics/contrib/projects/counts/:year', (req, res, next) => {
  pack(metricsAPI.topContribProjectsByYear(req, req.params.year), res, next);
});

router.get('/metrics/all', (req, res, next) => {
  pack(metricsAPI.allMetrics(req), res, next);
});

router.get('/reports/all', (req, res, next) => {
  pack(metricsAPI.getAllReports(req), res, next);
});

router.get('/reports/:id', (req, res, next) => {
  pack(metricsAPI.getReport(req, req.params.id), res, next);
});

router.get('/projects', (req, res, next) => {
  pack(projectsAPI.listProjects(req), res, next);
});

router.get('/projects/approval', async (req, res, next) => {
  pack(projectsAPI.listApprovalProjects(req), res, next);
});

// Implement when adding projects needed
router.post('/projects/new', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(projectsAPI.addProject(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /projects/new`);
    res.status(403);
    res.send({
      error: 'You do not posses the permissions to access that',
    });
  }
});

router.get('/projects/name/:projectName', (req, res, next) => {
  pack(projectsAPI.searchProjectByName(req, req.params.projectName), res, next);
});

router.get('/projects/:projectId', (req, res, next) => {
  pack(projectsAPI.searchProjectById(req, req.params.projectId), res, next);
});

router.get('/projects/unique/:projectId', (req, res, next) => {
  pack(projectsAPI.getUniqueProjectById(req, req.params.projectId), res, next);
});

router.get('/approvers', (req, res, next) => {
  pack(approversAPI.listApprovers(req), res, next);
});

router.post('/approvers/new', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (
    access.includes(AccessTypes.admin) ||
    access.includes(AccessTypes.approve)
  ) {
    pack(approversAPI.listApprovers(req), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /approvers/new`);
    return next(new AccessError('no access to adding approvers'));
  }
});

router.get('/approvers/:approverId', (req, res, next) => {
  pack(approversAPI.searchApprovers(req, req.params.approverId), res, next);
});

router.get('/contributions', (req, res, next) => {
  pack(contributionsAPI.listContributions(req), res, next);
});

router.get('/contributions/alias', (req, res, next) => {
  pack(contributionsAPI.getAllContributorAlias(req), res, next);
});

router.get('/contributions/bulk', (req, res, next) => {
  pack(contributionsAPI.listBulkContributions(req), res, next);
});

router.get('/contributions/approvals', (req, res, next) => {
  pack(contributionsAPI.listApprovalContributions(req), res, next);
});

router.post('/contributions/approve', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(contributionsAPI.approveContribution(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(
      `${user} did not have permissions to access /contributions/approve`
    );
    return next(new AccessError('no access to contribution approval'));
  }
});

// get oldest contribution year
router.get('/contributions/oldest', async (req, res, next) => {
  pack(contributionsAPI.getOldestContributionYear(req), res, next);
});

router.get('/contributions/:username', (req, res, next) => {
  pack(
    contributionsAPI.listUserContributions(req, req.params.username),
    res,
    next
  );
});

router.get('/contributions/single/:id', (req, res, next) => {
  pack(contributionsAPI.getSingleContribution(req, req.params.id), res, next);
});

router.post('/contributions/new', async (req, res, next) => {
  pack(contributionsAPI.addNewContribution(req, req.body), res, next);
});

router.post('/contributions/new/auto', async (req, res, next) => {
  const user = await getUser(req);
  const roles = await getRoles(user);
  if (!roles.has('auto-approve')) {
    return next(new AccessError('no access to auto-approve'));
  }
  pack(
    contributionsAPI.addNewAutoApprovedContribution(req, req.body, user),
    res,
    next
  );
});

router.post('/contributions/diffcheck', async (req, res, next) => {
  const user = await getUser(req);
  const roles = await getRoles(user);
  if (!roles.has('auto-approve')) {
    return next(new AccessError('no access to auto-approve'));
  }
  pack(contributionsAPI.diffCheck(req, req.body), res, next);
});

router.post('/contributions/update', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(contributionsAPI.updateContribution(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(
      `${user} did not have permissions to access /contributions/update`
    );
    return next(new AccessError('no access to contribution updates'));
  }
});

router.post('/contributions/update/link', async (req, res, next) => {
  const user = await getUser(req);
  if (user === req.body.user) {
    const confirm = await contributionsAPI.updateContributionLink(
      req,
      req.body
    );
    if (!confirm) {
      // success returns null
      res.status(200);
      res.send({
        msg: 'Successfully updated entry.',
      });
    } else {
      res.status(500);
      res.send({
        msg: 'Failed to update entry.',
      });
    }
  } else {
    winston.warn(`${user} not allowed to update contribution link`);
    return next(new AccessError('no access to update contribution link'));
  }
});

/**
 * API call for all the CLA related data.
 */

// Gets current list of CLA
router.get('/cla', (req, res, next) => {
  pack(claAPI.listCLA(req), res, next);
});

// Only gets the CLA project names
router.get('/cla/projects', (req, res, next) => {
  pack(claAPI.listCLAProjectNames(req), res, next);
});

// Single CLA via project_id
router.get('/cla/getproject/:id', (req, res, next) => {
  pack(claAPI.getCLA(req, req.params.id), res, next);
});

// Delete CLA
router.post('/cla/delete', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(claAPI.deleteCLA(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /cla/delete`);
    return next(new AccessError('no access to CLA management'));
  }
});

// Edit CLA
router.post('/cla/update', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(claAPI.updateCLA(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /cla/update`);
    return next(new AccessError('no access to CLA management'));
  }
});

// New CLA post request
router.post('/cla/submit', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(claAPI.addNewCLA(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /cla/submit`);
    return next(new AccessError('no access to CLA management'));
  }
});

/*
 * All API calls related to strategic groups
 */
// gets all strategic groups
router.get('/strategic/groups', async (req, res, next) => {
  pack(groupsAPI.listGroups(req), res, next);
});

// get all users that are in groups
router.get('/strategic/groups/users', async (req, res, next) => {
  pack(groupsAPI.listGroupUsers(req), res, next);
});

// add new group
router.post('/strategic/groups/new', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(groupsAPI.addNewGroup(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /admin/group`);
    return next(new AccessError('no access to Strategic Group management'));
  }
});

// update group
router.post('/strategic/groups/update', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(groupsAPI.updateGroup(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /group`);
    return next(new AccessError('no access to Strategic Group management'));
  }
});

// delete group
router.post('/strategic/groups/delete', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(groupsAPI.deleteGroup(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access edit group`);
    return next(new AccessError('no access to Strategic Group management'));
  }
});

// gets strategic group by id
router.get('/strategic/groups/:id', async (req, res, next) => {
  pack(groupsAPI.getGroup(req, req.params.id), res, next);
});

// gets strategic group info only by id
router.get('/strategic/group-details/:id', async (req, res, next) => {
  pack(groupsAPI.getGroupDetails(req, req.params.id), res, next);
});

// get all strategic contributions by group id
router.get('/strategic/contributions/group/:id', async (req, res, next) => {
  pack(
    contributionsAPI.listStrategicContributionsByGroup(req, req.params.id),
    res,
    next
  );
});

// get all strategic contributions by project id
router.get('/strategic/contributions/project/:id', async (req, res, next) => {
  pack(
    contributionsAPI.listStrategicContributionsByProject(req, req.params.id),
    res,
    next
  );
});

// get all strategic projects
router.get('/strategic/projects', async (req, res, next) => {
  pack(groupsAPI.listStrategicProjects(req), res, next);
});

// gets strategic project by id
router.get('/strategic/projects/:id', async (req, res, next) => {
  pack(groupsAPI.getStrategicProject(req, req.params.id), res, next);
});

// update project
router.post('/strategic/projects/update', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(groupsAPI.updateProject(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /group`);
    return next(new AccessError('no access to Strategic Group management'));
  }
});

// gets all users
router.get('/strategic/users', async (req, res, next) => {
  pack(groupsAPI.listUsers(req), res, next);
});

// add new user
router.post('/strategic/users/new', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(groupsAPI.addNewUser(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /admin/group`);
    return next(new AccessError('no access to Strategic Group management'));
  }
});

// get specific user
router.get('/strategic/users/:id', async (req, res, next) => {
  pack(groupsAPI.getUser(req, req.params.id), res, next);
});

// update user
router.post('/strategic/users/:id/update', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(groupsAPI.updateUser(req, req.params.id, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /group`);
    return next(new AccessError('no access to Strategic Group management'));
  }
});

// get strategic report
router.get('/strategic/report/:id/:date', async (req, res, next) => {
  pack(groupsAPI.getReport(req, req.params.id, req.params.date), res, next);
});

// error handling for all of the above
router.use(function(err: any, req: any, res: any, next: any) {
  if (
    err.name === 'UnauthorizedError' ||
    err.name === 'AccessError' ||
    err.name === 'RequestError'
  ) {
    res.status(err.status).send({ error: err.message });
    return;
  }

  winston.error(err.stack ? err.stack : err);
  res.status(500).send({ error: 'Internal error.' });
});

/**
 * Send API call results, calling error middleware on failure.
 */
function pack(promise, res, next) {
  if (!res || !next) {
    throw new Error('Missing response or next middleware parameters');
  }
  return promise
    .then(x => {
      if (x === null) {
        res.status(404).send('Object not found');
      } else {
        res.send(x);
      }
    })
    .catch(next);
}

async function getUser(req): Promise<string> {
  // Get username
  return await LDAP.getActiveUser(req);
}

/*
  levels of access:
    admin: administrators
    approver: can approve new projects
    anon: unknown users with minimal access
*/
enum AccessTypes {
  admin = 'admin',
  approve = 'approver',
  anon = 'anon',
}
// Middleware that stuffs user access levels into req.UserAccess
export async function checkAccess(req, res, next) {
  const user = await getUser(req);
  // Checks that the user has access to their requested information
  const groups = await LDAP.getGroups(user);
  const access = [];
  let len = config.admin.posixGroup.length;
  // Check if in admin groups
  for (let i = 0; i < len; i++) {
    if ((groups as any).includes(config.admin.posixGroup[i])) {
      access.push('admin');
    }
  }
  len = config.approver.posixGroup.length;
  // Check if in approver groups
  for (let i = 0; i < len; i++) {
    if ((groups as any).includes(config.approver.posixGroup[i])) {
      access.push('approver');
    }
  }
  // If access is empty then they aren't a member of a special group
  if (access.length === 0) {
    access.push('anon');
  }
  req.UserAccess = access;
  next();
}

/**
 * Given a username or a list of groups, return relevant roles.
 *
 * If a username is provided, groups are looked up automatically.
 */
async function getRoles(userOrGroups: string | string[]): Promise<Set<string>> {
  let groups = userOrGroups;
  if (typeof userOrGroups === 'string') {
    groups = await LDAP.getGroups(userOrGroups);
  }
  const roles = new Set();

  // check each role
  for (const role of Object.keys(config.roles)) {
    const roleGroups: Set<string> = config.roles[role];

    // look for any overlap in user groups & role groups
    for (const roleGroup of roleGroups) {
      if ((groups as any).includes(roleGroup)) {
        roles.add(role);
        break;
      }
    }
  }

  return roles;
}
