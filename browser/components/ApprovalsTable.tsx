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
import { Column, Table } from 'fixed-data-table';
import * as React from 'react';
import { CSVLink } from 'react-csv';
import * as Underscore from 'underscore';

import TableApprovalCell from '../components/TableApprovalCell';
import TableDateCell from '../components/TableDateCell';
import TableLinkCell from '../components/TableLinkCell';
import TableSortHeaderCell from '../components/TableSortHeaderCell';
import TableSummaryCell from '../components/TableSummaryCell';
import TableTextCell from '../components/TableTextCell';

interface Props extends React.Props<any> {
  approvalList: any;
}

interface State {
  approvalList: object[];
  sortDirection: string;
}

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export default class ApprovalsTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      approvalList: [],
      sortDirection: SortTypes.ASC,
    };
  }
  componentWillMount() {
    this.setState({
      approvalList: this.props.approvalList,
    });
  }

  onSortChange = key => {
    const sorted = Underscore.sortBy(this.props.approvalList, key);
    if (this.state.sortDirection === SortTypes.ASC) {
      this.setState({
        sortDirection: SortTypes.DESC,
        approvalList: sorted.reverse(),
      });
    } else {
      this.setState({
        sortDirection: SortTypes.ASC,
        approvalList: sorted,
      });
    }
  };

  getTable = () => {
    return (
      <div id="contributions_table_admin">
        <Table
          rowsCount={this.state.approvalList.length}
          rowHeight={50}
          headerHeight={50}
          width={1200}
          maxHeight={500}
        >
          <Column
            header={
              <TableSortHeaderCell
                onSortChange={() => {
                  this.onSortChange('project_name');
                }}
                sortDir="project_name"
              >
                Project
              </TableSortHeaderCell>
            }
            cell={
              <TableTextCell
                data={this.state.approvalList}
                field="project_name"
              />
            }
            width={125}
          />
          <Column
            header={
              <TableSortHeaderCell
                onSortChange={() => {
                  this.onSortChange('contribution_description');
                }}
                sortDir="contribution_description"
              >
                Contribution Description
              </TableSortHeaderCell>
            }
            cell={
              <TableSummaryCell
                data={this.state.approvalList}
                field="contribution_description"
              />
            }
            flexGrow={2}
            width={350}
          />
          <Column
            header={
              <TableSortHeaderCell
                onSortChange={() => {
                  this.onSortChange('contribution_url');
                }}
                sortDir="contribution_url"
              >
                Contribution URL
              </TableSortHeaderCell>
            }
            cell={
              <TableLinkCell
                data={this.state.approvalList}
                field="contribution_url"
              />
            }
            flexGrow={2}
            width={125}
          />
          <Column
            header={
              <TableSortHeaderCell
                onSortChange={() => {
                  this.onSortChange('contribution_submission_date');
                }}
                sortDir="contribution_submission_date"
              >
                Submission Date
              </TableSortHeaderCell>
            }
            cell={
              <TableDateCell
                data={this.state.approvalList}
                field="contribution_submission_date"
              />
            }
            flexGrow={2}
            width={100}
          />
          <Column
            header={
              <TableSortHeaderCell
                onSortChange={() => {
                  this.onSortChange('contributor_alias');
                }}
                sortDir="contributor_alias"
              >
                Contributor Alias
              </TableSortHeaderCell>
            }
            cell={
              <TableTextCell
                data={this.state.approvalList}
                field="contributor_alias"
              />
            }
            flexGrow={2}
            width={125}
          />
          <Column
            header={
              <TableSortHeaderCell
                onSortChange={() => {
                  this.onSortChange('project_id');
                }}
                sortDir="project_id"
              >
                Approve / Deny
              </TableSortHeaderCell>
            }
            cell={
              <TableApprovalCell
                data={this.state.approvalList}
                field="approval_status"
              />
            }
            flexGrow={2}
            width={150}
          />
        </Table>
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
