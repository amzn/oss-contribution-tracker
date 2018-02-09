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
import { Cell, Column, Table } from 'fixed-data-table';
import * as React from 'react';
import * as utils from '../util/exportCsv';

import TableApprovalStatusCell from '../components/TableApprovalStatusCell';
import TableDateCell from '../components/TableDateCell';
import TableEditCheckboxCell from '../components/TableEditCheckboxCell';
import TableGitHubStatusCell from '../components/TableGitHubStatusCell';
import TableLinkCell from '../components/TableLinkCell';
import TableSummaryCell from '../components/TableSummaryCell';
import TableTextCell from '../components/TableTextCell';


interface Props {
  contributionList: any;
}

interface State {
  contributionList: any;
  filteredDataList: any;
}

export default class EditContributionTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      contributionList: [],
      filteredDataList: [],
    };
  }

  componentWillMount() {
    let { contributionList } = this.props;
    this.setState({
      contributionList: contributionList,
      filteredDataList: contributionList,
    });
  }

  componentWillReceiveProps(nextProps) {
    // Grab props and fill data
    this.setState({
      contributionList: nextProps.contributionList,
      filteredDataList: nextProps.contributionList,
    });
  }
  _onFilterChange = (e, colName) => {
    if (!e.target.value) {
      this.setState({
        filteredDataList: this.state.contributionList,
      });
    }

    let filterBy = e.target.value.toLowerCase();
    let size = this.state.contributionList.length;
    let filteredContributions = [];
    for (let index = 0; index < size; index++) {
      let filter = this.state.contributionList[index][colName];
      let pos = filter.toLowerCase().indexOf(filterBy);
      if (pos !== -1) {
        filteredContributions.push(this.state.contributionList[index]);
      }
    }

    this.setState({
      filteredDataList: filteredContributions,
    });
  }

  searchHeader = (colName) => {
    let headText;
    switch (colName.columnKey) {
      case 'project_name':
        headText = 'Project Name';
        break;
      case 'contribution_description':
        headText = 'Summary';
        break;
      case 'submission_date':
        headText = 'Submission Date'
        break;
      case 'contributor_alias':
        headText = 'Contributor';
        break;
      default:
        console.log('Unknown columnKey');
        break;
    };

    return (
      <div>
        <Cell>
          <span>{ headText }</span>
          <br/>
          <input onChange={(e) => this._onFilterChange(e, colName.columnKey)} style={{width: 90 + '%'}} />
        </Cell>
      </div>
    );
  }

  csvDownload = () => {
    utils.onClickDownload(this.state.filteredDataList);
  }

  render() {
    let filtered = this.state.filteredDataList;
    return (
      <div key="contribution_edit_div" id="edit_contributions_admin_link">
        <Table
          key={'contribution_edit_table'}
          rowsCount={filtered ? filtered.length : 0}
          rowHeight={50}
          headerHeight={60}
          width={1200}
          maxHeight={500}>
          <Column
            key={'edit_link'}
            header={
              <Cell>Edit</Cell>
            }
            cell={
              <TableEditCheckboxCell
                data={filtered}
                field="contribution_id"
              />
            }
            width={50}
          />
          <Column
            key={'contribution_edit_project_name'}
            columnKey="project_name"
            header={ this.searchHeader.bind('project_name') }
            cell={
              <TableTextCell
                data={filtered}
                field="project_name"
                col="summary"
              />
            }
            width={150}
          />
          <Column
            key={'contribution_edit_description'}
            columnKey="contribution_description"
            header={ this.searchHeader.bind('contribution_description') }
            cell={
              <TableSummaryCell
                data={filtered}
                field="contribution_description"
                col="contribution_description"
              />
            }
            width={310}
          />
          <Column
            key={'contribution_edit_url'}
            columnKey="contrib_url"
            header={
              <Cell>Contrib URL</Cell>
            }
            cell={
              <TableLinkCell
                data={filtered}
                field="contribution_url"
                col="contrib_url"
              />
            }
            width={125}
          />
          <Column
            key={'contribution_edit_commit_url'}
            columnKey="commit_url"
            header={
                <Cell>Commit URL</Cell>
            }
            cell={
              <TableLinkCell
                data={filtered}
                field="contribution_commit_url"
                col="commit_url"
              />
            }
            width={125}
          />
          <Column
            key={'contribution_edit_submission_date'}
            columnKey="submission_date"
            header={ this.searchHeader.bind('submission_date') }
            cell={
              <TableDateCell
                data={filtered}
                field="contribution_submission_date"
                col="submission_date"
              />
            }
            width={175}
          />
          <Column
            key={'contribution_edit_approval_status'}
            columnKey="approval_status"
            header={
              <Cell>Approval Status</Cell>
            }
            cell={
              <TableApprovalStatusCell
                data={filtered}
                field="approval_status"
                col="approval_status"
              />
            }
            width={75}
          />
          <Column
            key={'contribution_edit_github_status'}
            columnKey="github_status"
            header={
                <Cell>GitHub Status</Cell>
            }
            cell={
              <TableGitHubStatusCell
                data={filtered}
                field="contribution_github_status"
                col="github_status"
              />
            }
            width={75}
          />
          <Column
            key={'contribution_edit_contributor_alias'}
            columnKey="contributor_alias"
            header={ this.searchHeader.bind('contributor_alias') }
            cell={
              <TableTextCell
                data={filtered}
                field="contributor_alias"
                col="contributor_alias"
              />
            }
            width={125}
          />
        </Table>
        <br/>
        <button onClick={this.csvDownload} className="btn btn-secondary">
          <i className="fa fa-download" /> Download CSV
        </button>
      </div>
    );
  }
}