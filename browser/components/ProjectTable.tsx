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

interface Props {
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
  type: string;
}

interface State {
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
              Header: <b>Project</b>,
              accessor: 'project_name',
              Cell: project => {
                return (
                  <a
                    href={
                      '/strategic-projects/project/' +
                      project.original.project_id
                    }
                  >
                    {project.original.project_name}
                  </a>
                );
              },
            },
            {
              Header: <b>Project URL</b>,
              accessor: 'project_url',
              Cell: d => <a href={d.value}>link</a>,
            },
            {
              Header: <b># Groups</b>,
              accessor: 'numGroups',
            },
            {
              Header: <b># Users</b>,
              accessor: 'numUsers',
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
              Header: <b>Project</b>,
              accessor: 'project_name',
              Cell: project => {
                return (
                  <a
                    href={
                      '/strategic-projects/project/' +
                      project.original.project_id
                    }
                  >
                    {project.original.project_name}
                  </a>
                );
              },
            },
            {
              Header: <b>Project URL</b>,
              accessor: 'project_url',
              Cell: d => <a href={d.value}>link</a>,
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
    const { type } = this.state;
    if (type === 'group') {
      return <div>{this.getGroupTable()}</div>;
    } else if (type === 'all') {
      return <div>{this.getAllTable()}</div>;
    }
    return <div />;
  }
}
