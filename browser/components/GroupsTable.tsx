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
import SweetAlert from 'react-bootstrap-sweetalert';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import ReportForm from './ReportForm';
import StrategicTableLinkCell from './StrategicTableLinkCell';

import * as actions from '../actions/strategicActions';

interface Props {
  updateAdminNav: (navpage) => void;
  updateAdminGroup: (groupId) => void;
  groups: {
    group_id: number;
    group_name: string;
    goal: string;
    sponsor: string;
    projects: number[];
    numUsers: number;
    contribWeek: number;
    contribMTD: number;
    contribMonth: number;
    contribYear: number;
  };
  type: string;
}

interface State {
  groupId: number;
  alert: JSX.Element;
}

class GroupsTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      groupId: 0,
      alert: null,
    };
  }

  handleEdit = e => {
    const groupId = e.target.id;
    this.props.updateAdminGroup(groupId);
    this.props.updateAdminNav('editGroup');
  };

  handleDownload = async e => {
    const groupId = e.target.id;
    await this.setState({ groupId });
    this.alert();
  };

  alert = () => {
    this.setState({
      alert: (
        <SweetAlert
          title="Report Date"
          onConfirm={this.hideAlert}
          showConfirm={false}
        >
          Please select the specific month and year for the report.
          <ReportForm
            groupId={this.props.groups[this.state.groupId].group_id}
            hideAlert={this.hideAlert}
          />
        </SweetAlert>
      ),
    });
  };

  hideAlert = () => {
    this.setState({ alert: null });
  };

  getAllTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.props.groups}
          columns={[
            {
              Header: <b>Group</b>,
              accessor: 'group_id',
              Cell: d => <StrategicTableLinkCell id={d.value} type="group" />,
            },
            {
              Header: <b># Projects</b>,
              accessor: 'numProjects',
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
            {
              Header: <b>Report</b>,
              accessor: 'group_id',
              width: 80,
              Cell: row => (
                <div className="center">
                  <Link to="/strategic-projects" onClick={this.handleDownload}>
                    <i id={row.index} className="fa fa-download" />
                  </Link>
                </div>
              ),
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          filterable={true}
        />
        {this.state.alert}
      </div>
    );
  };

  getEditTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.props.groups}
          columns={[
            {
              Header: <b>Edit</b>,
              accessor: 'group_id',
              width: 50,
              Cell: row => (
                <div className="center">
                  <Link to="/admin" onClick={this.handleEdit}>
                    <i id={row.value} className="fa fa-pencil-square" />
                  </Link>
                </div>
              ),
            },
            {
              Header: <b>Group</b>,
              accessor: 'group_id',
              Cell: d => <StrategicTableLinkCell id={d.value} type="group" />,
            },
            {
              Header: <b># Projects</b>,
              accessor: 'numProjects',
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
            {
              Header: <b>Report</b>,
              accessor: 'group_id',
              width: 80,
              Cell: row => (
                <div className="center">
                  <Link to="/admin" onClick={this.handleDownload}>
                    <i id={row.index} className="fa fa-download" />
                  </Link>
                </div>
              ),
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          filterable={true}
        />
        {this.state.alert}
      </div>
    );
  };

  getProjectTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.props.groups}
          columns={[
            {
              Header: <b>Group</b>,
              accessor: 'group_id',
              Cell: d => <StrategicTableLinkCell id={d.value} type="group" />,
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

  render() {
    const { type } = this.props;
    if (type === 'all') {
      return <div>{this.getAllTable()}</div>;
    } else if (type === 'project') {
      return <div>{this.getProjectTable()}</div>;
    } else if (type === 'edit') {
      return <div>{this.getEditTable()}</div>;
    }
    return <div />;
  }
}

const mapStateToProps = (state, props) => ({
  groups: props.groups.groupList || props.groups,
  type: props.type,
});

export default connect(
  mapStateToProps,
  actions
)(GroupsTable);
