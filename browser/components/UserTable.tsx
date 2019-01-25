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
import ReactTable from 'react-table';
import ExtensionPoint from '../util/ExtensionPoint';

interface Props {
  userList: any[];
}

interface State {
  userList: any[];
}

export default class UserTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      userList: this.props.userList,
    };
  }

  componentDidMount() {
    this.setState({
      userList: this.props.userList,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        userList: this.props.userList,
      });
    }
  }

  getTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.state.userList}
          columns={[
            {
              Header: <b>User</b>,
              accessor: 'company_alias',
              Cell: props => (
                <ExtensionPoint
                  ext="strategic-project-company_alias"
                  user={props.value}
                >
                  {' '}
                  {props.value}
                </ExtensionPoint>
              ),
            },
            {
              Header: <b>GitHub Alias</b>,
              accessor: 'github_alias',
              Cell: cellInfo => (
                <a
                  href={'https://github.com/' + cellInfo.value}
                  target="_blank"
                >
                  {' '}
                  {cellInfo.value}{' '}
                </a>
              ),
            },
            {
              Header: <b># Contribs Last Week</b>,
              accessor: 'contribWeek',
            },
            {
              Header: <b># Contribs MTD</b>,
              accessor: 'contribMTD',
            },
            {
              Header: <b># Contribs Last Month</b>,
              accessor: 'contribMonth',
            },
            {
              Header: <b># Contribs YTD</b>,
              accessor: 'contribYear',
            },
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
          filterable={true}
        />
      </div>
    );
  };

  render() {
    return <div>{this.getTable()}</div>;
  }
}
