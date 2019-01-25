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
import { CSVLink } from 'react-csv';
import ReactTable from 'react-table';

import TableApprovalCell from '../components/TableApprovalCell';
import TableLinkCell from '../components/TableLinkCell';

interface Props extends React.Props<any> {
  approvalList: any;
}

interface State {
  approvalList: object[];
}

export default class ApprovalsTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      approvalList: [],
    };
  }
  componentWillMount() {
    this.setState({
      approvalList: this.props.approvalList,
    });
  }

  getTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.state.approvalList}
          columns={[
            {
              Header: <strong>Project</strong>,
              accessor: 'project_name',
            },
            {
              Header: <strong>Contribution Description</strong>,
              accessor: 'contribution_description',
            },
            {
              Header: <strong>Contribution URL</strong>,
              accessor: 'contribution_url',
              Cell: row => <TableLinkCell link={row.value} />,
            },
            {
              Header: <strong>Submission Date</strong>,
              id: 'contribution_submission_date',
              accessor: d => d.contribution_submission_date.slice(0, 10),
            },
            {
              Header: <strong>Contributor Alias</strong>,
              accessor: 'contributor_alias',
            },
            {
              Header: <strong>Approval Status</strong>,
              accessor: 'contribution_id',
              Cell: row => <TableApprovalCell id={row.value} />,
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          filterable={true}
        />
        <br />
        <CSVLink
          data={this.state.approvalList}
          filename="Current-active-contribution.csv"
        >
          <button className="btn btn-secondary">
            <i className="fa fa-download" /> Download CSV
          </button>
        </CSVLink>
      </div>
    );
  };

  render() {
    return <div>{this.getTable()}</div>;
  }
}
