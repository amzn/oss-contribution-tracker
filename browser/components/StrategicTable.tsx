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
  contributionList: any;
  type: string;
}

interface State {
  contributionList: any;
  type: string;
}

export default class StrategicTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      contributionList: this.props.contributionList,
      type: this.props.type,
    };
  }

  componentDidMount() {
    this.setState({
      contributionList: this.props.contributionList,
      type: this.props.type,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      contributionList: nextProps.contributionList,
      type: this.props.type,
    });
  }

  // cuts off the time in the stored datetime format to have (yyyy-mm-dd) which is 10 characters
  sliceDate = date => {
    return date.slice(0, 10);
  };

  getGroupTable = () => {
    if (this.state.contributionList !== null) {
      return (
        <div id="contributions_table_admin">
          <ReactTable
            data={this.state.contributionList}
            columns={[
              {
                Header: <b>Project</b>,
                accessor: 'project_name',
              },
              {
                Header: <b>Description</b>,
                accessor: 'contribution_description',
              },
              {
                Header: <b>Commit URL</b>,
                accessor: 'contribution_url',
                Cell: d => <a href={d.value}>link</a>,
              },
              {
                Header: <b>Submission Date</b>,
                id: 'contribution_date',
                accessor: d => this.sliceDate(d.contribution_date),
              },
              {
                Header: <b>Contributor Alias</b>,
                accessor: 'contributor_alias',
              },
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            filterable={true}
          />
        </div>
      );
    } else {
      return <div />;
    }
  };

  getProjectTable = () => {
    if (this.state.contributionList !== null) {
      return (
        <div id="contributions_table_admin">
          <ReactTable
            data={this.state.contributionList}
            columns={[
              {
                Header: <b>Description</b>,
                accessor: 'contribution_description',
              },
              {
                Header: <b>Commit URL</b>,
                accessor: 'contribution_url',
                Cell: d => <a href={d.value}>link</a>,
              },
              {
                Header: <b>Submission Date</b>,
                id: 'contribution_date',
                accessor: d => this.sliceDate(d.contribution_date),
              },
              {
                Header: <b>Contributor Alias</b>,
                accessor: 'contributor_alias',
              },
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            filterable={true}
          />
        </div>
      );
    } else {
      return <div />;
    }
  };

  render() {
    if (this.state.type === 'group') {
      return <div>{this.getGroupTable()}</div>;
    } else if (this.state.type === 'project') {
      return <div>{this.getProjectTable()}</div>;
    }
    return <div />;
  }
}
