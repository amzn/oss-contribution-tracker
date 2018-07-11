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
// tslint:disable:no-console

import { postJSON, reqJSON } from '../util/index';

export const ActionTypes = {
  FETCH_GROUPS: 'FETCH_GROUPS',
  FETCH_GROUP: 'FETCH_GROUP',
  FETCH_PROJECTS: 'FETCH_PROJECTS',
  FETCH_STRATEGIC_PROJECTS: 'FETCH_STRATEGIC_PROJECTS',
  FETCH_PROJECT: 'FETCH_PROJECT',
  FETCH_USERS: 'FETCH_USERS',
  FETCH_GROUP_CONTRIBS: 'FETCH_GROUP_CONTRIBS',
  FETCH_PROJECT_CONTRIBS: 'FETCH_PROJECT_CONTRIBS',
  UPDATE_ADMIN_NAV: 'UPDATE_ADMIN_NAV',
  UPDATE_ADMIN_GROUP: 'UPDATE_ADMIN_GROUP',
};

export function fetchGroups() {
  return async dispatch => {
    try {
      const groups = await reqJSON('/api/strategicgroups');
      return dispatch({
        type: ActionTypes.FETCH_GROUPS,
        payload: groups.groupList,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchGroup(id) {
  return async dispatch => {
    try {
      const group = await reqJSON(`/api/strategicgroups/${id}`);
      return dispatch({ type: ActionTypes.FETCH_GROUP, payload: group });
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchGroupContribs(id) {
  return async dispatch => {
    try {
      const contribs = await reqJSON(`/api/strategiccontributions/group/${id}`);
      return dispatch({
        type: ActionTypes.FETCH_GROUP_CONTRIBS,
        payload: contribs,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchProjects() {
  return async dispatch => {
    try {
      const projects = await reqJSON(`/api/projects`);
      return dispatch({
        type: ActionTypes.FETCH_PROJECTS,
        payload: projects.projectList,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchUsers() {
  return async dispatch => {
    try {
      const users = await reqJSON(`/api/strategicusers`);
      return dispatch({ type: ActionTypes.FETCH_USERS, payload: users.users });
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateGroup(group, callback) {
  return async dispatch => {
    try {
      await postJSON('/api/strategicgroups/update', group);
      return callback('modified');
    } catch (error) {
      console.error(error);
    }
  };
}

export function addNewGroup(group, callback) {
  return async dispatch => {
    try {
      await postJSON('/api/strategicgroups/new', group);
      return callback();
    } catch (error) {
      console.error(error);
    }
  };
}

export function addNewProject(project, callback) {
  return async dispatch => {
    try {
      const result = await postJSON('/api/projects/new', project);
      return callback(result.projectList);
    } catch (error) {
      console.error(error);
    }
  };
}

export function addNewUser(user, callback) {
  return async dispatch => {
    try {
      const result = await postJSON('/api/strategicusers/new', user);
      return callback(result.result);
    } catch (error) {
      console.error(error);
    }
  };
}

export function deleteGroup(id, callback) {
  return async dispatch => {
    try {
      await postJSON('/api/strategicgroups/delete', id);
      return callback('deleted');
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateAdminNav(nav) {
  return dispatch => {
    dispatch({ type: ActionTypes.UPDATE_ADMIN_NAV, payload: nav });
  };
}

export function updateAdminGroup(groupId) {
  return dispatch => {
    dispatch({ type: ActionTypes.UPDATE_ADMIN_GROUP, payload: groupId });
  };
}
