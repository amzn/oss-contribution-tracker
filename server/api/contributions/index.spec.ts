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
import * as mockery from 'mockery';

describe('index', () => {
  let mock: any;
  let contributions: any;

  beforeEach(() => {
    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    mock = {
      dbgroups: {
        getGroupById: jasmine.createSpy('dbgroups').and.callFake(groupId => {
          if (groupId === 1) {
            return {
              group_id: 1,
              group_name: 'Test 1',
              projects: [1, 2],
            };
          } else if (groupId === 2) {
            return {
              group_id: 2,
              group_name: 'Test 2',
              projects: [1, 3],
            };
          } else {
            return {};
          }
        }),
      },
      dbusers: {
        getUsernamesByGroup: jasmine
          .createSpy('dbusers')
          .and.callFake(groupId => {
            if (groupId.toString() === '1') {
              return { names: ['alpha', 'beta'] };
            } else if (groupId.toString() === '2') {
              return { names: ['alpha', 'charlie'] };
            } else {
              return { names: ['alpha', 'beta', 'charlie'] };
            }
          }),
        getUsersByGroup: jasmine.createSpy('dbusers').and.returnValue([
          {
            company_alias: 'alpha',
            github_alias: 'alpha',
            groups: {
              '1': '2018-05-05',
              '2': '2018-05-05',
            },
          },
          {
            company_alias: 'beta',
            github_alias: 'beta',
            groups: {
              '1': '2017-08-08',
              '2': '2017-08-08',
            },
          },
        ]),
      },
      dbcontributions: {
        listStrategicContributionsByGroup: jasmine
          .createSpy('dbcontributions')
          .and.returnValue([
            {
              contribution_id: 1,
              project_id: 1,
              contribution_description: 'test contrib 1',
              contirbution_date: '2018-06-11',
              contributor_alias: 'alpha',
              contribution_url: 'A.com/contrib1',
            },
            {
              contribution_id: 2,
              project_id: 2,
              contribution_description: 'test contrib 2',
              contirbution_date: '2018-06-08',
              contributor_alias: 'beta',
              contribution_url: 'B.com/contrib2',
            },
          ]),
        listStrategicContributionsByUser: jasmine
          .createSpy('dbcontributions')
          .and.returnValue([
            {
              contribution_id: 1,
              project_id: 1,
              contribution_description: 'test contrib 1',
              contirbution_date: '2018-06-11',
              contributor_alias: 'alpha',
              contribution_url: 'A.com/contrib1',
            },
            {
              contribution_id: 2,
              project_id: 2,
              contribution_description: 'test contrib 2',
              contirbution_date: '2018-06-08',
              contributor_alias: 'beta',
              contribution_url: 'B.com/contrib2',
            },
          ]),
        listStrategicContributionsByProject: jasmine
          .createSpy('dbcontributions')
          .and.returnValue([
            {
              contribution_id: 1,
              project_id: 1,
              contribution_description: 'test contrib 1',
              contirbution_date: '2018-06-11',
              contributor_alias: 'alpha',
              contribution_url: 'A.com/contrib1',
            },
            {
              contribution_id: 2,
              project_id: 1,
              contribution_description: 'test contrib 2',
              contirbution_date: '2018-06-22',
              contributor_alias: 'beta',
              contribution_url: 'A.com/contrib2',
            },
          ]),
      },
      dbprojects: {
        searchProjectById: jasmine
          .createSpy('dbprojects')
          .and.callFake(projectId => {
            if (projectId === 1) {
              return [
                {
                  project_id: 1,
                  project_name: 'A',
                  project_url: 'A.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
              ];
            } else if (projectId === 2) {
              return [
                {
                  project_id: 2,
                  project_name: 'B',
                  project_url: 'B.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
              ];
            } else if (projectId === 3) {
              return [
                {
                  project_id: 3,
                  project_name: 'C',
                  project_url: 'C.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
              ];
            } else {
              return [];
            }
          }),
      },
    };
    mockery.registerMock('../../db/groups', {
      getGroupById: mock.dbgroups.getGroupById,
    });
    mockery.registerMock('../../db/projects', {
      searchProjectById: mock.dbprojects.searchProjectById,
    });
    mockery.registerMock('../../db/users', {
      getUsernamesByGroup: mock.dbusers.getUsernamesByGroup,
      getUsersByGroup: mock.dbusers.getUsersByGroup,
    });
    mockery.registerMock('../../db/contributions', {
      listStrategicContributionsByGroup:
        mock.dbcontributions.listStrategicContributionsByGroup,
      listStrategicContributionsByProject:
        mock.dbcontributions.listStrategicContributionsByProject,
      listStrategicContributionsByUser:
        mock.dbcontributions.listStrategicContributionsByUser,
    });
    mockery.registerAllowable('./index');
    contributions = require('./index');
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('contributions', () => {
    it('should list all contributions by group', async done => {
      const contribs = await contributions.listStrategicContributionsByGroup(
        {},
        1
      );
      expect(mock.dbgroups.getGroupById).toHaveBeenCalled();
      expect(mock.dbusers.getUsersByGroup).toHaveBeenCalled();
      expect(
        mock.dbcontributions.listStrategicContributionsByUser
      ).toHaveBeenCalled();
      expect(mock.dbprojects.searchProjectById).toHaveBeenCalled();
      expect(contribs).toEqual([
        {
          contribution_id: 1,
          project_id: 1,
          contribution_description: 'test contrib 1',
          contirbution_date: '2018-06-11',
          contributor_alias: 'alpha',
          contribution_url: 'A.com/contrib1',
          project_name: 'A',
        },
        {
          contribution_id: 2,
          project_id: 2,
          contribution_description: 'test contrib 2',
          contirbution_date: '2018-06-08',
          contributor_alias: 'beta',
          contribution_url: 'B.com/contrib2',
          project_name: 'B',
        },
        {
          contribution_id: 1,
          project_id: 1,
          contribution_description: 'test contrib 1',
          contirbution_date: '2018-06-11',
          contributor_alias: 'alpha',
          contribution_url: 'A.com/contrib1',
          project_name: 'A',
        },
        {
          contribution_id: 2,
          project_id: 2,
          contribution_description: 'test contrib 2',
          contirbution_date: '2018-06-08',
          contributor_alias: 'beta',
          contribution_url: 'B.com/contrib2',
          project_name: 'B',
        },
      ]);
      done();
    });
    it('should list all contributions by project', async done => {
      const contribs = await contributions.listStrategicContributionsByProject(
        {},
        1
      );
      expect(
        mock.dbcontributions.listStrategicContributionsByProject
      ).toHaveBeenCalled();
      expect(contribs).toEqual({
        list: [
          {
            contribution_id: 1,
            project_id: 1,
            contribution_description: 'test contrib 1',
            contirbution_date: '2018-06-11',
            contributor_alias: 'alpha',
            contribution_url: 'A.com/contrib1',
          },
          {
            contribution_id: 2,
            project_id: 1,
            contribution_description: 'test contrib 2',
            contirbution_date: '2018-06-22',
            contributor_alias: 'beta',
            contribution_url: 'A.com/contrib2',
          },
        ],
      });
      done();
    });
  });
});
