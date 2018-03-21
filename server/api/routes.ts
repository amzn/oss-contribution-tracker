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

import * as approversAPI from './approvers';
import * as claAPI from'./cla';
import * as contributionsAPI from './contributions';
import * as metricsAPI from './metrics';
import * as projectsAPI from './projects';

export let router = express.Router();

router.use(bodyParser.json({limit: '1000kb'}));
router.use(bodyParser.urlencoded({
  extended: true,
}));

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
  };
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

router.get('/projects', (req, res, next) => {
  pack(projectsAPI.listProjects(req), res, next);
});

router.get('/projects/approval', async (req, res, next) => {
  pack(projectsAPI.listApprovalProjects(req), res, next);
});

// Implement when adding projects needed
/*router.post('/projects/new', (req, res, next) => {
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
  };
});*/

router.get('/projects/name/:projectName', (req, res, next) => {
  pack(projectsAPI.searchProjectByName(req, req.params.projectName), res, next);
});

router.get('/projects/:projectId', (req, res, next) => {
  pack(projectsAPI.searchProjectById(req, req.params.projectId), res, next);
});

router.get('/approvers', (req, res, next) => {
  pack(approversAPI.listApprovers(req), res, next);
});

router.post('/approvers/new', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin) || access.includes(AccessTypes.approve)) {
    pack(approversAPI.listApprovers(req), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /approvers/new`);
    res.status(403);
    res.send({
      error: 'You do not posses the permissions to access that',
    });
  };
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
    winston.warn(`${user} did not have permissions to access /contributions/approve`);
    res.status(403);
    res.send({
      error: 'You do not posses the permissions to access that',
    });
  };
});

router.get('/contributions/:username', (req, res, next) => {
  pack(contributionsAPI.listUserContributions(req, req.params.username), res, next);
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
    res.status(401).send('no access to auto-approve');
    return;
  }
  pack(contributionsAPI.addNewAutoApprovedContribution(req, req.body, user), res, next);
});

router.post('/contributions/diffcheck', async (req, res, next) => {
  const user = await getUser(req);
  const roles = await getRoles(user);
  if (!roles.has('auto-approve')) {
    res.status(401).send('no access to auto-approve');
    return;
  }
  pack(contributionsAPI.diffCheck(req, req.body), res, next);
});

router.post('/contributions/newautoapproval', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(contributionsAPI.addNewContributionAutoApproval(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /contributions/newautoapproval`);
    res.status(403);
    res.send({
      error: 'You do not posses the permissions to access that',
    });
  };
});

router.post('/contributions/update', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(contributionsAPI.updateContribution(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /contributions/update`);
    res.status(403);
    res.send({
      error: 'You do not posses the permissions to access that',
    });
  };
});

router.post('/contributions/update/link', async (req, res, next) => {
  const user = getUser(req);
  if (user === req.body.user) {
    const confirm = await contributionsAPI.updateContributionLink(req, req.body);
    if (!confirm) { // success returns null
      res.status(200);
      res.send({
        msg: 'Successfully updated entry.',
      });
    } else {
      res.status(500);
      res.send({
        msg: 'Failed to update entry.',
      });
    };
  } else {
    winston.warn('$1 not allowed to update contributions github link', [user]);
    res.status(401);
    res.send({
      error: 'Not allowed to update contributions github link',
    });
  };
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
router.post('/cla/delete', async(req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(claAPI.deleteCLA(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /cla/delete`);
    res.status(403);
    res.send({
      error: 'You do not posses the permissions to access that',
    });
  };
});

// Edit CLA
router.post('/cla/update', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(claAPI.updateCLA(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /cla/update`);
    res.status(403);
    res.send({
      error: 'You do not posses the permissions to access that',
    });
  };
});

// New CLA post request
router.post('/cla/submit', async (req, res, next) => {
  const access = (req as any).UserAccess;
  if (access.includes(AccessTypes.admin)) {
    pack(claAPI.addNewCLA(req, req.body), res, next);
  } else {
    const user = await getUser(req);
    winston.warn(`${user} did not have permissions to access /cla/submit`);
    res.status(403);
    res.send({
      error: 'You do not posses the permissions to access that',
    });
  };
});

// error handling for all of the above
router.use(function (err: any, req: any, res: any, next: any) {
  if (err.name === 'UnauthorizedError'
      || err.name === 'AccessError'
      || err.name === 'RequestError') {
    res.status(err.status).send({error: err.message});
    return;
  }

  winston.error(err.stack ? err.stack : err);
  res.status(500).send({error: 'Internal error.'});
});

/**
 * Send API call results, calling error middleware on failure.
 */
function pack(promise, res, next) {
  if (!res || !next) throw new Error('Missing response or next middleware parameters');
  return promise
    .then(x => {
      if (x === null) {
        res.status(404).send('Object not found');
      } else {
        res.send(x);
      }
    })
    .catch((err) => {
      winston.error(err);
      res.status(500).send('Internal error');
    });
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
  let user = await getUser(req);
  // Checks that the user has access to their requested information
  let groups = await LDAP.getGroups(user);
  let access = [];
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