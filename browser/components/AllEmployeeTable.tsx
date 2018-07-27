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
import { connect } from 'react-redux';
import ReactTable from 'react-table';

import * as EmployeeTableAction from '../actions/employeeTableAction';
import TableApprovalStatusCell from '../components/TableApprovalStatusCell';
import TableLinkCell from '../components/TableLinkCell';
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
  filteredDataList: object[];
}

class AllEmployeeTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currAlias: '',
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

  sliceDate(date) {
    return date.slice(0, 10);
  }

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
          <ReactTable
            data={filteredDataList}
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
                Header: <strong>Contribution URL </strong>,
                accessor: 'contribution_url',
                Cell: row => <TableLinkCell link={row.value} />,
              },
              {
                Header: <strong>Submission Date</strong>,
                id: 'contribution_submission_date',
                accessor: d => this.sliceDate(d.contribution_submission_date),
              },
              {
                Header: <strong>Approval Status</strong>,
                accessor: 'approval_status',
                Cell: row => (
                  <TableApprovalStatusCell approval_status={row.value} />
                ),
              },
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
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
