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
import ReactTable from 'react-table';
import ReactTooltip = require('react-tooltip');

import TableEditCell from '../components/TableEditCell';
import TableLinkCell from '../components/TableLinkCell';
import TooltipCell from '../components/TableTooltipCell';

interface Props {
  cla: object[];
}

interface State {
  cla: object[];
}

export default class ClaTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cla: [],
    };
  }

  componentWillMount() {
    this.setState({
      cla: this.props.cla,
    });
  }

  sliceDate(date) {
    return date.slice(0, 10);
  }

  getTable = () => {
    return (
      <div key="cla_div" id="view_cla_table">
        <ReactTable
          data={this.state.cla}
          onScrollEnd={() => {
            ReactTooltip.rebuild();
          }}
          columns={[
            {
              Header: <strong>Edit</strong>,
              accessor: 'project_id',
              width: 50,
              Cell: row => <TableEditCell type="cla" id={row.value} />,
            },
            {
              Header: <strong>Project</strong>,
              accessor: 'project_name',
            },
            {
              Header: <strong>Contributor[s]</strong>,
              accessor: 'contributor_name',
            },
            {
              Header: <strong>Signatory Name</strong>,
              accessor: 'signatory_name',
            },
            {
              Header: <strong>Approver Name</strong>,
              accessor: 'approver_name',
            },
            {
              Header: <strong>Point of Contact</strong>,
              accessor: 'contact_name',
            },
            {
              Header: <strong>Ticket URL</strong>,
              accessor: 'ticket_link',
              Cell: row => <TableLinkCell link={row.value} />,
            },
            {
              Header: <strong>Date Approved</strong>,
              id: 'date_approved',
              accessor: d => this.sliceDate(d.date_approved),
            },
            {
              Header: <strong>Date Signed</strong>,
              id: 'date_signed',
              accessor: d => this.sliceDate(d.date_signed),
            },
            {
              Header: <strong>Notes</strong>,
              accessor: 'additional_notes',
              width: 50,
              Cell: row => <TooltipCell notes={row.value} />,
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          filterable={true}
        />
        <ReactTooltip place="top" type="dark" effect="float" />
      </div>
    );
  };

  render() {
    return <div>{this.getTable()}</div>;
  }
}
