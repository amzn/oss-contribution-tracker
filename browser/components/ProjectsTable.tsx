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

import TableApprovalStatusCell from '../components/TableApprovalStatusCell';
import TableDateCell from '../components/TableDateCell';
import TableGitHubStatusCell from '../components/TableGitHubStatusCell';
import TableLinkCell from '../components/TableLinkCell';
import TableSummaryCell from '../components/TableSummaryCell';
import TableTextCell from '../components/TableTextCell';

interface Props {
  type: string;
  contributionList: any;
  dispatch: object;
}

export default class ProjectsTable extends React.Component<Props, {}> {
  createTables = () => {
    // Iterates and renders tables
    const type = this.props.type;
    let tableProps = {};
    switch (type) {
      case 'all':
        tableProps = {
          summaryWidth: 400,
          contributor: true,
        };
        break;
      case 'individual':
        tableProps = {
          summaryWidth: 525,
          contributor: false,
        };
        break;
    }
    const table = [];
    const cl = this.props.contributionList;
    for (const [key, value] of Object.entries(cl)) {
      table.push(ProjectsTable.renderTables(key, value, tableProps));
    }
    return table;
  }

  static contributorEntry = (item, exists) => {
    if (exists) {
      return (
        <Column
          key={item.name + '_contributor'}
          header={<Cell>Contributor</Cell>}
          cell={
            <TableTextCell
              data={item}
              field="contributor_alias"
            />
          }
          width={125}
        />
      );
    }
  }

  static renderTables = (name, item, tableProps) => {
    let count = 0;
    return (
      <div key={count++}>
        <h4>Project {name}</h4>
        <Table
          key={item.name + '_table'}
          rowsCount={item.length}
          rowHeight={50}
          headerHeight={50}
          width={950}
          maxHeight={500}>
          <Column
            key={item.name + '_summary'}
            header={<Cell>Summary</Cell>}
            cell={
              <TableSummaryCell
                data={item}
                field="contribution_description"
              />
            }
            width={tableProps.summaryWidth}
          />
          <Column
            key={item.name + '_url'}
            header={<Cell>Commit URL</Cell>}
            cell={
              <TableLinkCell
                data={item}
                field="contribution_commit_url"
              />
            }
            width={75}
          />
          <Column
            key={item.name + '_submission_date'}
            header={<Cell>Submission Date</Cell>}
            cell={
              <TableDateCell
                data={item}
                field="contribution_submission_date"
              />
            }
            width={100}
          />
          <Column
            key={item.name + '_approval_status'}
            header={<Cell>Approval Status</Cell>}
            cell={
              <TableApprovalStatusCell
                data={item}
                field="approval_status"
              />
            }
            width={125}
          />
          <Column
            key={item.name + '_github_status'}
            header={<Cell>Github Status</Cell>}
            cell={
              <TableGitHubStatusCell
                data={item}
                field="contribution_github_status"
              />
            }
            width={125}
          />
          {tableProps.contributor ? ProjectsTable.contributorEntry(item, tableProps.contributor) : <div/>}
        </Table>
        <br/>
      </div>
    );
  }

  render() {
    const contributionList = this.props.contributionList;
    return (
      <div>
        { contributionList ? this.createTables() : '' }
      </div>
    );
  }
}
