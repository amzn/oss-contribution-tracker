/* Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
import { Component } from 'react';

import { reqJSON } from '../util/index';

import ContributionEditor from '../components/ContributionEditor';

interface Props {
  params: any;
}

interface State {
  contrib_data: string;
  projects: any;
}

export default class EditContribution extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      contrib_data: '',
      projects: {},
    };
  }

  async componentWillMount() {
    const id = (this.props as any).match.params.contrib_id;
    const contrib = await reqJSON(`/api/contributions/single/${id}`);
    this.setState({
      contrib_data: contrib[0],
    });

    const projects = await reqJSON('/api/projects');
    this.setState({
      projects: projects.projectList,
    });
  }

  render() {
    return (
      <div className="container">
        <div className="container-fluid">
          <ContributionEditor
            contrib_data={this.state.contrib_data}
            projects={this.state.projects}
          />
        </div>
      </div>
    );
  }
}
