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
import ProjectTable from '../components/ProjectTable';

interface State {
  groupList: any;
  projectList: any;
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
    const groupList = await reqJSON('/api/strategicgroups');
    const projectList = await reqJSON('/api/strategicprojects');
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