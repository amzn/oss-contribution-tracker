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

import ProjectTable from '../components/ProjectTable';
import StrategicTable from '../components/StrategicTable';
import UserTable from '../components/UserTable';

interface Props {
  params: any;
}

interface State {
  projectList: any;
  userList: any;
  group: any;
  contributionList: any;
}

export default class Group extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      projectList: [],
      userList: [],
      group: [],
      contributionList: [],
    };
  }

  async componentDidMount() {
    const groupId = (this.props as any).match.params.group_id;
    const group = await reqJSON('/api/strategicgroups/' + groupId.toString());
    const contributions = await reqJSON(
      '/api/strategiccontributions/group/' + groupId.toString()
    );
    this.setState({
      projectList: group.projects,
      userList: group.users,
      group: group.group,
      contributionList: contributions,
    });
  }

  render() {
    return (
      <div>
        <h2> {this.state.group.group_name} Group Details </h2>
        <hr />
        <h4> Projects </h4>
        <div id="contributionsListAll">
          <ProjectTable projectList={this.state.projectList} type="group" />
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
            type="group"
          />
        </div>
      </div>
    );
  }
}
