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
import * as React from 'react';
import { reqJSON } from '../util/index';

import GroupsTable from '../components/GroupsTable';
import StrategicTable from '../components/StrategicTable';
import UserTable from '../components/UserTable';

interface Props {
  params: any;
}

interface State {
  groupList: any;
  userList: any;
  project: any;
  contributionList: any;
}

export default class Project extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
      userList: [],
      project: [],
      contributionList: [],
    };
  }

  async componentDidMount() {
    const projectId = (this.props as any).match.params.project_id;
    const project = await reqJSON(
      '/api/strategicprojects/' + projectId.toString()
    );
    const contributions = await reqJSON(
      '/api/strategiccontributions/project/' + projectId.toString()
    );
    this.setState({
      groupList: project.groups,
      userList: project.users,
      project: project.project,
      contributionList: contributions,
    });
  }

  render() {
    return (
      <div>
        <h2> {this.state.project.project_name} Details </h2>
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
