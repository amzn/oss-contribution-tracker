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
import { Component } from 'react';

import ContributionsForm from '../components/ContributionsForm';
import { reqJSON  } from '../util/index';

interface Props {
  dispatch: any;
}

interface State {
  user: {
    name: string;
  };
  projects: any;
  approvers: any;
}

export default class Contributions extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '',
      },
      projects: {},
      approvers: {},
    };
  }

  componentWillMount() {
    // Maybe store user info in redux once I have session stuff
    reqJSON('/api/projects').then(temp => {
      this.setState({
        projects: temp.projectList,
      });
    });

    reqJSON('/api/approvers').then(temp => {
      this.setState({
        approvers: {
          name: temp.approverList,
        },
      });
    });
  }

  render() {
    return (
      <ContributionsForm approvers={this.state.approvers.name} projects={this.state.projects} />
    );
  }
}