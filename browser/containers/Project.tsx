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
import * as React from 'react';
import { Link } from 'react-router-dom';
import { reqJSON } from '../util/index';

import GroupsTable from '../components/GroupsTable';
import StrategicTable from '../components/StrategicTable';
import UserTable from '../components/UserTable';

interface Props {
  params: any;
  user: {
    user: string;
    groups: string[];
    roles: string[];
    access: string[];
  };
}

interface State {
  groupList: Array<{
    group_id: number;
    group_name: string;
    goal: string;
    sponsor: string;
    projects: number[];
    numUsers: number;
    contribWeek: number;
    contribMTD: number;
    contribMonth: number;
    contribYear: number;
  }>;
  userList: Array<{
    company_alias: string;
    contribMTD: number;
    contribMonth: number;
    contribWeek: number;
    contribYear: number;
    github_alias: string;
    groups: any; // in the format of an number: string, however the number is always changing so I cannot specify a key
  }>;
  project: {
    project_id?: number;
    project_name?: string;
    project_url?: string;
    project_license?: string;
    project_verified?: boolean;
    project_auto_approvable?: boolean;
  };
  contributionList: Array<{
    approval_date: string;
    approval_notes: string;
    approval_status: string;
    approver_id: number;
    contirbution_closed_date: string;
    contribution_date: string;
    contirbution_description: string;
    contribution_github_status: string;
    contribution_id: number;
    contribution_metdata: any;
    contribution_project_review: boolean;
    contribution_submission_date: string;
    contribution_url: string;
    contributor_alias: string;
    project_id: number;
    project_name: string;
  }>;
}

export default class Project extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
      userList: [],
      project: {},
      contributionList: [],
    };
  }

  async componentDidMount() {
    const projectId = this.props.params.project_id;
    const project = await reqJSON(
      '/api/strategic/projects/' + projectId.toString()
    );
    const contributions = await reqJSON(
      '/api/strategic/contributions/project/' + projectId.toString()
    );
    this.setState({
      groupList: project.groups,
      userList: project.users,
      project: project.project,
      contributionList: contributions.list,
    });
  }

  render() {
    return (
      <div>
        {this.props.user.access.includes('admin') ? (
          <Link
            className="badge badge-danger"
            id="edit-group"
            to={`/admin?strategic_project=${this.state.project.project_id}`}
          >
            Edit Project
          </Link>
        ) : (
          <div />
        )}
        <h2> {this.state.project.project_name} - Project Details </h2>
        <hr />
        <h4> Groups </h4>
        <div id="contributionsListAll">
          <GroupsTable groups={this.state.groupList} type="project" />
        </div>
        <br />
        <h4> Whitelisted Users </h4>
        <div id="contributionsListAll">
          <UserTable userList={this.state.userList} />
        </div>
        <br />
        <h4> Contributions </h4>
        <div id="contributionsListAll">
          <StrategicTable
            contributionList={this.state.contributionList}
            type="project"
          />
        </div>
      </div>
    );
  }
}
