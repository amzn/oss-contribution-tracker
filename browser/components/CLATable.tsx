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
import ReactTooltip = require('react-tooltip');
import * as Underscore from 'underscore';

import TableDateCell from '../components/TableDateCell';
import TableEditCellForCla from '../components/TableEditCellForCla';
import TableLinkCell from '../components/TableLinkCell';
import TableSortHeaderCell from '../components/TableSortHeaderCell';
import TableSummaryCell from '../components/TableSummaryCell';
import TableTextCell from '../components/TableTextCell';
import TooltipCell from '../components/TableTooltipCell';

interface Props {
  cla: object[];
}

interface State {
  cla: object[];
  sortDirection: string;
}

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export default class ClaTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cla: [],
      sortDirection: SortTypes.ASC,
    };
  }

  componentWillMount() {
    this.setState({
      cla: this.props.cla,
    });
  }

  componentDidCatch(error, info) {
    // tslint:disable-next-line:no-console
    console.error(error);
  }

  _onSortChange = (key) => {
    const sorted = Underscore.sortBy(this.state.cla, key);
    if (this.state.sortDirection === SortTypes.ASC) {
      this.setState({
        sortDirection: SortTypes.DESC,
        cla: sorted.reverse(),
      });
    } else {
      this.setState({
        sortDirection: SortTypes.ASC,
        cla: sorted,
      });
    }
  }

  getTable = () => {
    return (
      <div key="cla_div" id="view_cla_table">
        <Table
          rowsCount={this.state.cla.length}
          rowHeight={50}
          headerHeight={50}
          width={1250}
          maxHeight={500}
          onScrollEnd = {() => { ReactTooltip.rebuild(); }}
        >
          <Column
              key={'edit_link'}
              header={
                <TableSortHeaderCell
                  _onSortChange={() => { this._onSortChange('project_id'); }}
                  sortDir="project_id">
                  Edit
                </TableSortHeaderCell>
              }
              cell={
                <TableEditCellForCla
                  data={this.state.cla}
                  field="project_id"
                />
              }
              width={50}
          />
          <Column
            header={
              <TableSortHeaderCell
                _onSortChange={() => { this._onSortChange('project_name'); }}
                sortDir="project_name">
                Project
              </TableSortHeaderCell>
            }
            cell={
              <TableTextCell
                data={this.state.cla}
                field="project_name"
              />
            }
            width={100}
          />
          <Column
            header={
              <TableSortHeaderCell
                _onSortChange={() => {this._onSortChange('contributor_name'); }}
                sortDir="contributor_name">
                Contributor[s]
              </TableSortHeaderCell>
            }
            cell={
              <TableTextCell
                data={this.state.cla}
                field="contributor_name"
              />
            }
            flexGrow={2}
            width={225}
          />
          <Column
            header={
              <TableSortHeaderCell
                _onSortChange={() => {this._onSortChange('signatory_name'); }}
                sortDir="signatory_name">
                Signatory Name
              </TableSortHeaderCell>
            }
            cell={
              <TableSummaryCell
                data={this.state.cla}
                field="signatory_name"
              />
            }
            flexGrow={2}
            width={125}
          />
          <Column
            header={
              <TableSortHeaderCell
                _onSortChange={() => {this._onSortChange('approver_name'); }}
                sortDir="approver_name">
                Approver Name
              </TableSortHeaderCell>
            }
            cell={
              <TableSummaryCell
                data={this.state.cla}
                field="approver_name"
              />
            }
            flexGrow={2}
            width={100}
          />
          <Column
            header={
              <TableSortHeaderCell
                _onSortChange={() => {this._onSortChange('contact_name'); }}
                sortDir="contact_name">
                Point of Contact
              </TableSortHeaderCell>
            }
            cell={
              <TableTextCell
                data={this.state.cla}
                field="contact_name"
              />
            }
            flexGrow={2}
            width={75}
          />
          <Column
            header=
            {
              <TableSortHeaderCell
                _onSortChange={() => {this._onSortChange('ticket_link'); }}
                sortDir="ticket_link">
                Ticket URL
              </TableSortHeaderCell>
            }
            cell={
              <TableLinkCell
                data={this.state.cla}
                field="ticket_link"
              />
            }
            flexGrow={2}
            width={75}
          />
          <Column
            header={
              <TableSortHeaderCell
                _onSortChange={() => {this._onSortChange('date_approved'); }}
                sortDir="date_approved">
                Date Approved
              </TableSortHeaderCell>
            }
            cell={
              <TableDateCell
                data={this.state.cla}
                field="date_approved"
              />
            }
            flexGrow={2}
            width={100}
          />
          <Column
            header={
              <TableSortHeaderCell
                _onSortChange={() => {this._onSortChange('date_signed'); }}
                sortDir="date_signed">
                Date Signed
              </TableSortHeaderCell>
            }
            cell={
              <TableDateCell
                data={this.state.cla}
                field="date_signed"
              />
            }
            flexGrow={2}
            width={100}
          />
          <Column
            key={'notes_link'}
            header={
              <TableSortHeaderCell
                _onSortChange={() => {this._onSortChange('additional_notes'); }}
                sortDir="additional_notes">
                Notes
              </TableSortHeaderCell>
            }
            cell={<TooltipCell data={this.state.cla} field="additional_notes"/>}
            width={65}
          />
        </Table>
        <ReactTooltip place="top" type="dark" effect="float"/>
      </div>
    );
  }

  render() {
    return(
      <div>
        {this.getTable()}
      </div>
    );
  }
}
