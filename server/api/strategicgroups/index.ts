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
import * as dbcontributions from '../../db/contributions';
import * as dbgroups from '../../db/groups';
import * as dbprojects from '../../db/projects';
import * as dbusers from '../../db/users';

export async function listGroups(req) {
  const groupList = await dbgroups.listGroups();
  for (const group of groupList) {
    const users = (await dbusers.getUsernamesByGroup([
      group.group_id.toString(),
    ])).names;
    const contribWeek = await dbcontributions.getLastWeekCount(
      group.projects,
      users
    );
    const contribMTD = await dbcontributions.getMTDCount(group.projects, users);
    const contribMonth = await dbcontributions.getLastMonthCount(
      group.projects,
      users
    );
    const contribYear = await dbcontributions.getYTDCount(
      group.projects,
      users
    );

    group.numUsers = users ? users.length : 0;
    group.numProjects = group.projects.length;
    group.contribWeek = parseInt(contribWeek.numcontribs, 10);
    group.contribMTD = parseInt(contribMTD.numcontribs, 10);
    group.contribMonth = parseInt(contribMonth.numcontribs, 10);
    group.contribYear = parseInt(contribYear.numcontribs, 10);
  }
  return { groupList };
}

export async function listStrategicProjects(req) {
  const projectList = await dbprojects.getAllStrategicProjects();
  for (const project of projectList) {
    const groups = (await dbgroups.searchGroupIdsByProjectId(
      project.project_id
    )).groups;
    const users = (await dbusers.getUsernamesByGroup(groups)).names;
    const contribWeek = await dbcontributions.getLastWeekCount(
      [project.project_id],
      users
    );
    const contribMTD = await dbcontributions.getMTDCount(
      [project.project_id],
      users
    );
    const contribMonth = await dbcontributions.getLastMonthCount(
      [project.project_id],
      users
    );
    const contribYear = await dbcontributions.getYTDCount(
      [project.project_id],
      users
    );

    project.numGroups = groups.length;
    project.numUsers = users ? users.length : 0;
    project.contribWeek = parseInt(contribWeek.numcontribs, 10);
    project.contribMTD = parseInt(contribMTD.numcontribs, 10);
    project.contribMonth = parseInt(contribMonth.numcontribs, 10);
    project.contribYear = parseInt(contribYear.numcontribs, 10);
  }
  return { projectList };
}

export async function getGroupDetails(req, id) {
  const group = await dbgroups.getGroupById(id);
  return { group };
}

export async function getGroup(req, id) {
  const group = await dbgroups.getGroupById(id);
  const projects = await dbprojects.getProjectsByGroup(id);
  const users = await dbusers.getUsersByGroup(id.toString());
  const usernames = (await dbusers.getUsernamesByGroup([id.toString()])).names;

  for (const project of projects) {
    const projId = [project.project_id];
    const contribWeek = await dbcontributions.getLastWeekCount(
      projId,
      usernames
    );
    const contribMTD = await dbcontributions.getMTDCount(projId, usernames);
    const contribMonth = await dbcontributions.getLastMonthCount(
      projId,
      usernames
    );
    const contribYear = await dbcontributions.getYTDCount(projId, usernames);

    project.contribWeek = parseInt(contribWeek.numcontribs, 10);
    project.contribMTD = parseInt(contribMTD.numcontribs, 10);
    project.contribMonth = parseInt(contribMonth.numcontribs, 10);
    project.contribYear = parseInt(contribYear.numcontribs, 10);
  }

  for (const user of users) {
    const username = [user.company_alias];
    const pList = group.projects;

    const contribWeek = await dbcontributions.getLastWeekCount(pList, username);
    const contribMTD = await dbcontributions.getMTDCount(pList, username);
    const contribMonth = await dbcontributions.getLastMonthCount(
      pList,
      username
    );
    const contribYear = await dbcontributions.getYTDCount(pList, username);

    user.contribWeek = parseInt(contribWeek.numcontribs, 10);
    user.contribMTD = parseInt(contribMTD.numcontribs, 10);
    user.contribMonth = parseInt(contribMonth.numcontribs, 10);
    user.contribYear = parseInt(contribYear.numcontribs, 10);
  }

  return { group, projects, users };
}

export async function getStrategicProject(req, id) {
  const project = await dbprojects.getUniqueProjectById(id);
  const groups = await dbgroups.getGroupsByProjectId([id]);
  const groupIds = (await dbgroups.searchGroupIdsByProjectId(id)).groups;
  const users = (await dbusers.getUsernamesByGroup(groupIds)).names;
  const projId = [project.project_id];
  const userList = [];

  for (const group of groups) {
    const usernames = (await dbusers.getUsernamesByGroup([
      group.group_id.toString(),
    ])).names;
    const contribWeek = await dbcontributions.getLastWeekCount(
      projId,
      usernames
    );
    const contribMTD = await dbcontributions.getMTDCount(projId, usernames);
    const contribMonth = await dbcontributions.getLastMonthCount(
      projId,
      usernames
    );
    const contribYear = await dbcontributions.getYTDCount(projId, usernames);

    group.contribWeek = parseInt(contribWeek.numcontribs, 10);
    group.contribMTD = parseInt(contribMTD.numcontribs, 10);
    group.contribMonth = parseInt(contribMonth.numcontribs, 10);
    group.contribYear = parseInt(contribYear.numcontribs, 10);
  }

  for (const user of users) {
    const contribWeek = await dbcontributions.getLastWeekCount(projId, [user]);
    const contribMTD = await dbcontributions.getMTDCount(projId, [user]);
    const contribMonth = await dbcontributions.getLastMonthCount(projId, [
      user,
    ]);
    const contribYear = await dbcontributions.getYTDCount(projId, [user]);

    const data = {
      company_alias: user,
      contribWeek: parseInt(contribWeek.numcontribs, 10),
      contribMTD: parseInt(contribMTD.numcontribs, 10),
      contribMonth: parseInt(contribMonth.numcontribs, 10),
      contribYear: parseInt(contribYear.numcontribs, 10),
    };
    userList.push(data);
  }
  return { project, groups, users: userList };
}

export async function getUser(req, id) {
  return { user: await dbusers.searchUserByCompanyAlias(id) };
}

export async function listProjects(req) {
  return { projectList: await dbprojects.getProjectsByGroup(req.body.id) };
}

export async function listUsers(req) {
  return { users: await dbusers.listAllUsers() };
}

export async function listGroupUsers(req) {
  return { users: await dbusers.listAllUsersInGroups() };
}

export async function addNewGroup(req, body) {
  const groupId = await dbgroups.addNewGroup(
    body.groupName,
    body.sponsorName,
    body.goals,
    body.projects
  );
  for (const user of body.users) {
    const id = groupId.group_id;
    const date = new Date().toISOString().substring(0, 10);
    const group = {};
    group[id] = date;

    await dbusers.addGroupsToUser(user, group);
  }
  return { groupId };
}

export async function addNewUser(req, body) {
  const groups = {};
  if (body.groups.length) {
    const date = body.date || new Date().toISOString().substring(0, 10);
    for (const group of body.groups) {
      groups[group] = date;
    }
  }

  return {
    result: await dbusers.addNewUser(
      body.company_alias,
      body.github_alias,
      groups
    ),
  };
}

export async function updateGroup(req, body) {
  const oldUsers = (await dbusers.getUsernamesByGroup([
    body.groupId.toString(),
  ])).names;
  const updatedGroup = await dbgroups.updateGroup(
    body.groupId,
    body.groupName,
    body.sponsorName,
    body.goals,
    body.projects
  );
  const updatedUsers = [];
  for (const user of body.users) {
    updatedUsers.push(user);
    if (!oldUsers || !oldUsers.includes(user)) {
      const id = body.groupId;
      const date = new Date().toISOString().substring(0, 10);
      const group = {};
      group[id] = date;

      await dbusers.addGroupsToUser(user, group);
    }
  }
  const deletedUsers = oldUsers
    ? oldUsers.filter(user => updatedUsers.indexOf(user) < 0)
    : [];
  for (const user of deletedUsers) {
    await dbusers.removeGroupFromUser(user, body.groupId);
  }
  return { updatedGroup };
}

export async function deleteGroup(req, body) {
  const users = (await dbusers.getUsernamesByGroup([body.id.toString()])).names;
  if (users) {
    for (const user of users) {
      await dbusers.removeGroupFromUser(user, body.id);
    }
  }
  return { group: await dbgroups.deleteGroup(body.id) };
}

export async function updateUser(req, id, body) {
  return { user: await dbusers.updateUser(id, body.github_alias, body.groups) };
}

export async function getReport(req, id, date) {
  const group = await dbgroups.getGroupById(id);
  const projects = await dbprojects.getProjectsByGroup(id);
  const users = await dbusers.getUsersByGroup(id);
  const usernames = (await dbusers.getUsernamesByGroup([id])).names;

  group.total = 0;
  group.strategic = 0;

  for (const project of projects) {
    const projId = project.project_id;

    project.contributions = await dbcontributions.monthlyStrategicContributionsByProject(
      projId,
      usernames,
      date
    );
    project.total = parseInt(
      (await dbcontributions.monthlyTotalByProject(projId, date)).total,
      10
    );
    project.strategic = project.contributions.length;

    group.total += project.total;
    group.strategic += project.strategic;
  }

  for (const user of users) {
    user.total = parseInt(
      (await dbcontributions.monthlyTotalByUser(
        group.projects,
        user.company_alias,
        date
      )).total,
      10
    );
  }

  return { group, projects, users };
}
