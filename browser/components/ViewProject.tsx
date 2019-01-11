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
import Select from 'react-select';

import EditProject from './EditProject';

interface Props {
  direct: boolean;
  groupList: [
    {
      goal: string;
      group_id: number;
      group_name: string;
      contribMTD: number;
      contribMonth: number;
      contribWeek: number;
      contribYear: number;
      numGroups: number;
      numUsers: number;
      projects: number[];
      sponsor: string;
    }
  ];
  projectID: any;
  projectList: [
    {
      contribMTD: number;
      contribMonth: number;
      contribWeek: number;
      contribYear: number;
      numGroups: number;
      numUsers: number;
      project_auto_aprovable: boolean;
      project_id: number;
      project_license: string;
      project_name: string;
      project_url: string;
      project_verified: boolean;
    }
  ];
}

interface State {
  currentProject: string;
}

export default class ViewProject extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentProject: '',
    };
  }

  componentDidMount() {
    if (this.props.direct) {
      this.setState({
        currentProject: this.props.projectID,
      });
    }
  }

  setProject = e => {
    this.setState({ currentProject: e.value || '' });
  };

  projectList = () => {
    const projects = this.props.projectList;
    return projects.map(listValue => {
      return {
        label: listValue.project_name,
        value: listValue.project_id,
      };
    });
  };

  render() {
    if (this.props.projectList) {
      const projectOptions = this.projectList();
      return (
        <div>
          <br />
          <Select
            id="user"
            placeholder="Select a project"
            options={projectOptions}
            onChange={this.setProject}
            required={true}
            menuContainerStyle={{ zIndex: 4 }}
            openOnFocus={true}
            value={this.state.currentProject}
          />
          <br />
          <EditProject
            project={this.state.currentProject}
            groupList={this.props.groupList}
          />
        </div>
      );
    } else {
      return <div>Loading projects...</div>;
    }
  }
}
