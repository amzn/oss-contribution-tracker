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
import StrategicTableLinkCell from './StrategicTableLinkCell';

import * as actions from '../actions/strategicActions';
import * as utils from '../util/generateReport';
import { reqJSON } from '../util/index';

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

  handleDownload = e => {
    const groupId = e.target.id;
    this.setState({ groupId });
    this.alert();
  };

  alert = () => {
    this.setState({
      alert: (
        <SweetAlert
          title="Report Date"
          onConfirm={this.downloadReport}
          showConfirm={false}
        >
          Please select the specific month and year for the report.
          <form onSubmit={this.downloadReport}>
            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="month">Select month</label>
                <select className="form-control" id="month">
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div className="form-group col">
                <label htmlFor="year">Select year</label>
                <select className="form-control" id="year">
                  <option>2018</option>
                  <option>2017</option>
                  <option>2016</option>
                  <option>2015</option>
                  <option>2014</option>
                </select>
              </div>
            </div>
            <div className="row justify-content-around">
              <button
                className="btn btn-warning btn-lg col-4"
                onClick={this.hideAlert}
              >
                {' '}
                Cancel{' '}
              </button>
              <button type="submit" className="btn btn-primary btn-lg col-4">
                {' '}
                Download{' '}
              </button>
            </div>
          </form>
        </SweetAlert>
      ),
    });
  };

  downloadReport = async e => {
    e.preventDefault();
    const fields = e.target.elements;
    const group = this.props.groups[this.state.groupId];
    const report = await reqJSON(
      `/api/strategic/report/${group.group_id}/${fields.year.value}-${
        fields.month.value
      }`
    );
    report.date = `${fields.year.value}-${fields.month.value}`;
    utils.onClickDownload(report);
    this.hideAlert();
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

export default connect(mapStateToProps, actions)(GroupsTable);
