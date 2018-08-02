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

interface Props {
  id: string;
  type: string;
}

interface State {
  group: {
    group_id: number;
    group_name: string;
    goal: string;
    sponsor: string;
    projects: number[];
  };
  project: {
    project_id: number;
    project_name: string;
    project_url: string;
    project_license: string;
    project_verified: boolean;
    project_auto_approvable: boolean;
  };
  type: string;
}

export default class StrategicTableLinkCell extends React.Component<
  Props,
  State
> {
  constructor(props) {
    super(props);
    this.state = {
      group: null,
      project: null,
      type: this.props.type,
    };
  }

  async componentDidMount() {
    const type = this.props.type;
    if (type === 'group') {
      const group = await reqJSON('/api/strategic/groups/' + this.props.id);
      this.setState({ group: group.group });
    } else if (type === 'project') {
      const projectResult = await reqJSON(
        '/api/projects/unique/' + this.props.id.toString()
      );
      this.setState({ project: projectResult.project });
    }
  }

  renderProjectLink = () => {
    if (this.state.project) {
      return (
        <a href={'/strategic-projects/project/' + this.props.id}>
          {' '}
          {this.state.project.project_name}{' '}
        </a>
      );
    } else {
      return <div />;
    }
  };

  renderGroupLink = () => {
    if (this.state.group) {
      return (
        <a href={'/strategic-projects/group/' + this.props.id}>
          {this.state.group.group_name}{' '}
        </a>
      );
    } else {
      return <div />;
    }
  };

  render() {
    const { type } = this.state;
    if (type === 'group') {
      return this.renderGroupLink();
    } else if (type === 'project') {
      return this.renderProjectLink();
    }
    return <div />;
  }
}
