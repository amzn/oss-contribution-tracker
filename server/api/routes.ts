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

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true,
}));

router.get('/user', async (req, res, next) => {
  // check for midway id token in req
  let user = getUser(req);
  let groups = await LDAP.getGroups(user)
  res.send({
    user,
    groups,
  });
});

router.get('/config/display', (req, res, next) => {
  // return users defined in server config
  res.send(config.display);
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
  pack(projectsAPI.addProject(req, req.body), res, next);
});*/

router.get('/projects/name/:projectName', (req, res, next) => {
  pack(projectsAPI.searchProjectByName(req, req.params.projectName), res, next);
});

router.get('/api/projects/:projectId', (req, res, next) => {
  pack(projectsAPI.searchProjectById(req, req.params.projectId), res, next);
});

router.get('/approvers', (req, res, next) => {
  pack(approversAPI.listApprovers(req), res, next);
});

router.post('/approvers/new', async (req, res, next) => {
  pack(approversAPI.listApprovers(req), res, next);
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
  pack(contributionsAPI.approveContribution(req, req.body), res, next);
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

router.post('/contributions/newautoapproval', async (req, res, next) => {
  pack(contributionsAPI.addNewContributionAutoApproval(req, req.body), res, next);
});

router.post('/contributions/update', async (req, res, next) => {
  pack(contributionsAPI.updateContribution(req, req.body), res, next);
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
  pack(claAPI.deleteCLA(req, req.body), res, next);
});

// Edit CLA
router.post('/cla/update', async (req, res, next) => {
  pack(claAPI.updateCLA(req, req.body), res, next);
});

// New CLA post request
router.post('/cla/submit', async (req, res, next) => {
  pack(claAPI.addNewCLA(req, req.body), res, next);
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

function getUser(req) {
  // Get username
  return LDAP.getActiveUser(req);
}

/*
  Note: No longer using in OSS version but being left for future features
  levels of access:
    admin: administrators
    approver: can approve new projects
    anon: unknown users with minimal access
*/
type AccessTypes =
  'admin'
  | 'approver'
  | 'anon';

export async function checkAccess(user): Promise<AccessTypes> {
  // Checks that the user has access to their requested information
  let groups = await LDAP.getGroups(user);
  let access;
  let len = config.admin.posixGroup.length;
  for (let i = 0; i < len; i++) {
    if ((groups as any).includes(config.admin.posixGroup[i])) {
      access = 'admin';
    }
  }
  if (!access) {
    if ((groups as any).includes(config.approver.posixGroup)) {
      access = 'approver';
    } else {
      access = 'anon';
    }
  }
  return access;
}

export function approvedAccess(type, list): boolean {
  if (list.includes(type)) {
    return true;
  } else {
    return false;
  }
}