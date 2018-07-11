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
import ReactTable from 'react-table';
import StrategicTableLinkCell from './StrategicTableLinkCell';

interface Props {
  projectList: any;
  type: string;
}

interface State {
  projectList: any;
  type: string;
}

export default class ProjectTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      projectList: this.props.projectList,
      type: this.props.type,
    };
  }

  componentDidMount() {
    this.setState({
      projectList: this.props.projectList,
      type: this.props.type,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      projectList: nextProps.projectList,
      type: nextProps.type,
    });
  }

  getAllTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.state.projectList}
          columns={[
            {
              Header: <strong>Project</strong>,
              accessor: 'project_id',
              Cell: d => <StrategicTableLinkCell id={d.value} type='project'/>
            },
            {
              Header: <strong>Project URL</strong>,
              accessor: 'project_url',
              Cell: d => <a href={d.value}>link</a>
            },
            {
              Header: <strong># Groups</strong>,
              accessor: 'numGroups',
            },
            {
              Header: <strong># Users</strong>,
              accessor: 'numUsers',
            },
            {
              Header: <strong># Contribs Last Week</strong>,
              accessor: 'contribWeek',
            },
            {
              Header: <strong># Contribs MTD</strong>,
              accessor: 'contribMTD',
            },
            {
              Header: <strong># Contribs Last Month</strong>,
              accessor: 'contribMonth',
            },
            {
              Header: <strong># Contribs YTD</strong>,
              accessor: 'contribYear',
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          filterable={true}
        />
      </div>
    );
  };

  getGroupTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.state.projectList}
          columns={[
            {
              Header: <strong>Project</strong>,
              accessor: 'project_id',
              Cell: d => <StrategicTableLinkCell id={d.value} type='project'/>
            },
            {
              Header: <strong>Project URL</strong>,
              accessor: 'project_url',
              Cell: d => <a href={d.value}>link</a>
            },
            {
              Header: <strong># Contribs Last Week</strong>,
              accessor: 'contribWeek',
            },
            {
              Header: <strong># Contribs MTD</strong>,
              accessor: 'contribMTD',
            },
            {
              Header: <strong># Contribs Last Month</strong>,
              accessor: 'contribMonth',
            },
            {
              Header: <strong># Contribs YTD</strong>,
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
    const { type } = this.state;
    if (type === 'group') {
      return <div>{this.getGroupTable()}</div>;
    } else if (type === 'all') {
      return <div>{this.getAllTable()}</div>;
    }
    return <div />
  }
}
