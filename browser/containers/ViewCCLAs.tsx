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
import CLATable from '../components/CLATable';
import { reqJSON } from '../util/index';

interface State {
  claTable: any;
}

class ViewCCLAs extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      claTable: null,
    };
  }

  async componentWillMount() {
    const claList = await reqJSON('/api/cla');
    this.setState({
      claTable: claList.claTable,
    });
  }

  render() {
    if (!this.state.claTable) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="panel-body" key={'viewCCLA'}>
          <CLATable cla={this.state.claTable} />
        </div>
      );
    }
  }
}

export default ViewCCLAs;
