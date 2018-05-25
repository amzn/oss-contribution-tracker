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
import { connect } from 'react-redux';
import * as Underscore from 'underscore';

import * as EmployeeTableAction from '../actions/employeeTableAction';
import TableApprovalStatusCell from '../components/TableApprovalStatusCell';
import TableDateCell from '../components/TableDateCell';
import TableLinkCell from '../components/TableLinkCell';
import TableSortHeaderCell from '../components/TableSortHeaderCell';
import TableSummaryCell from '../components/TableSummaryCell';
import TableTextCell from '../components/TableTextCell';
import ExtensionPoint from '../util/ExtensionPoint';

interface OwnProps {
  alias: string;
}

interface Props extends OwnProps {
  dispatch: any;
  filteredDataList: any;
}

interface State {
  currAlias: any;
  sortDirection: string;
  filteredDataList: object[];
}

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

class AllEmployeeTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currAlias: '',
      sortDirection: SortTypes.ASC,
      filteredDataList: this.props.filteredDataList
        ? this.props.filteredDataList
        : [],
    };
  }

  componentWillMount() {
    const { dispatch, alias, filteredDataList } = this.props;
    if (alias !== undefined && this.state.currAlias !== alias) {
      dispatch(EmployeeTableAction.fetchUserContribution(alias));
      this.setState({
        currAlias: alias,
        filteredDataList,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, alias } = this.props;
    const { filteredDataList } = nextProps;
    if (
      (alias === undefined && this.state.currAlias === '') ||
      nextProps.alias !== this.state.currAlias
    ) {
      dispatch(EmployeeTableAction.fetchUserContribution(alias));
      this.setState({
        currAlias: alias,
      });
    }
    if (
      filteredDataList !== undefined &&
      filteredDataList !== this.state.filteredDataList
    ) {
      this.setState({
        filteredDataList,
      });
    }
  }

  onSortChange = key => {
    const sorted = Underscore.sortBy(this.state.filteredDataList, key);
    if (this.state.sortDirection === SortTypes.ASC) {
      this.setState({
        sortDirection: SortTypes.DESC,
        filteredDataList: sorted.reverse(),
      });
    } else {
      this.setState({
        sortDirection: SortTypes.ASC,
        filteredDataList: sorted,
      });
    }
  };

  getTable = () => {
    const { filteredDataList } = this.state;
    if (
      this.state.currAlias &&
      filteredDataList !== undefined &&
      filteredDataList.length > 0
    ) {
      return (
        <div key="contribution_edit_div">
          <h4>Contributions by {this.state.currAlias}</h4>
          <ExtensionPoint ext="ldap-info" alias={this.state.currAlias} />
          <Table
            rowsCount={filteredDataList ? filteredDataList.length : 0}
            rowHeight={50}
            headerHeight={50}
            width={1000}
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
                  data={filteredDataList ? filteredDataList : []}
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
                  data={filteredDataList ? filteredDataList : []}
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
                  data={filteredDataList ? filteredDataList : []}
                  field="contribution_url"
                />
              }
              flexGrow={2}
              width={75}
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
                  data={filteredDataList ? filteredDataList : []}
                  field="contribution_submission_date"
                />
              }
              flexGrow={2}
              width={100}
            />
            <Column
              key={'contribution_edit_approval_status'}
              columnKey="approval_status"
              header={
                <TableSortHeaderCell
                  onSortChange={() => {
                    this.onSortChange('approval_status');
                  }}
                  sortDir="approval_status"
                >
                  Approval Status
                </TableSortHeaderCell>
              }
              cell={
                <TableApprovalStatusCell
                  data={filteredDataList ? filteredDataList : []}
                  field="approval_status"
                  col="approval_status"
                />
              }
              width={100}
            />
          </Table>
        </div>
      );
    } else {
      return <p>Enter an alias of a user above.</p>;
    }
  };

  render() {
    const tables = this.getTable();
    return <div>{tables}</div>;
  }
}

export default connect((state, props: OwnProps) => ({
  filteredDataList: state.employeeTable.filteredDataList,
  alias: props.alias,
}))(AllEmployeeTable);
