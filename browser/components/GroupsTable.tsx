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
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import StrategicTableLinkCell from './StrategicTableLinkCell';

import * as actions from '../actions/strategicActions';

interface Props {
  updateAdminNav: any;
  updateAdminGroup: any;
  groups: any;
  type: string;
}

class GroupsTable extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      type: '',
    };
  }

  handleEdit = e => {
    const groupId = e.target.id;
    this.props.updateAdminGroup(groupId);
    this.props.updateAdminNav('editGroup');
  };

  getAllTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.props.groups.groupList}
          columns={[
            {
              Header: <strong>Group</strong>,
              accessor: 'group_id',
              Cell: d => <StrategicTableLinkCell id={d.value} type="group" />,
            },
            {
              Header: <strong># Projects</strong>,
              accessor: 'numProjects',
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

  getEditTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.props.groups}
          columns={[
            {
              Header: <strong>Edit</strong>,
              accessor: 'group_id',
              width: 50,
              Cell: row => (
                <div className="center">
                  {' '}
                  <Link to="/admin" onClick={this.handleEdit}>
                    <i id={row.value} className="fa fa-pencil-square" />
                  </Link>{' '}
                </div>
              ),
            },
            {
              Header: <strong>Group</strong>,
              accessor: 'group_id',
              Cell: d => <StrategicTableLinkCell id={d.value} type="group" />,
            },
            {
              Header: <strong># Projects</strong>,
              accessor: 'numProjects',
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

  getProjectTable = () => {
    return (
      <div id="contributions_table_admin">
        <ReactTable
          data={this.props.groups}
          columns={[
            {
              Header: <strong>Group</strong>,
              accessor: 'group_id',
              Cell: d => <StrategicTableLinkCell id={d.value} type="group" />,
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
  groups: props.groups,
  type: props.type,
});

export default connect(mapStateToProps, actions)(GroupsTable);
