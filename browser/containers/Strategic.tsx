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
import { reqJSON } from '../util/index';

import GroupsTable from '../components/GroupsTable';
import ProjectTable from '../components/ProjectTable';

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
  projectList: Array<{
    project_id: number;
    project_name: string;
    project_url: string;
    project_license: string;
    project_verified: boolean;
    project_auto_approvable: boolean;
    contribWeek: number;
    contribMTD: number;
    contribMonth: number;
    contribYear: number;
    numGroups?: number;
    numUsers?: number;
  }>;
}

export default class Strategic extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
      projectList: [],
    };
  }

  async componentDidMount() {
    const groupList = await reqJSON('/api/strategic/groups');
    const projectList = await reqJSON('/api/strategic/projects');
    this.setState({
      groupList,
      projectList: projectList.projectList,
    });
  }

  render() {
    return (
      <div>
        <h4>Strategic Groups</h4>
        <GroupsTable groups={this.state.groupList} type="all" />
        <br />
        <h4>Strategic Projects</h4>
        <ProjectTable projectList={this.state.projectList} type="all" />
      </div>
    );
  }
}
