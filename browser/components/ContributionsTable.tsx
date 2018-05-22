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
import { connect } from 'react-redux';

import TableApprovalStatusCell from '../components/TableApprovalStatusCell';
import TableDateCell from '../components/TableDateCell';
import TableGitHubStatusCell from '../components/TableGitHubStatusCell';
import TableLinkCell from '../components/TableLinkCell';
import TableSummaryCell from '../components/TableSummaryCell';
import TableTextCell from '../components/TableTextCell';

interface OwnProps {
  contributionList: any;
  type: string;
}

interface Props extends OwnProps {
  dispatch: any;
}

interface State {
  tables: any;
  projectNames: any;
  selectedProject: string;
  search: string;
}

class ContributionsTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      tables: new Map(),
      projectNames: new Array(),
      selectedProject: null,
      search: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // Grab props and create our tables
    this.createTables(nextProps.contributionList);
  }

  createTables = contributionList => {
    const type = this.props.type;
    let tableProps = {};
    const newTables = new Map();
    const newProjectNames = new Array();

    switch (type) {
      case 'all':
        tableProps = {
          summaryWidth: 350,
          contributor: true,
        };
        break;
      case 'individual':
        tableProps = {
          summaryWidth: 400,
          contributor: false,
        };
        break;
      default:
        throw new Error('Improper type passed to createTables.');
    }
    for (const [key, value] of Object.entries(contributionList)) {
      newTables.set(
        key,
        ContributionsTable.renderTables(key, value, tableProps)
      );
      newProjectNames.push(key.toLowerCase());
    }
    newProjectNames.sort();

    this.setState({
      tables: newTables,
      projectNames: newProjectNames,
      selectedProject: null,
    });
  };

  updateSelectedProject = item => e => {
    e.preventDefault();
    this.setState({
      selectedProject: item,
    });
  };

  storeSearch = e => {
    this.setState({
      search: e.currentTarget.value.toLowerCase(),
      selectedProject: null,
    });
  };

  static contributorEntry = (item, exists) => {
    if (exists) {
      return (
        <Column
          key={item.name + '_contributor'}
          header={<Cell>Contributor Alias</Cell>}
          cell={
            <TableTextCell
              data={item}
              field="contributor_alias"
              col="contributor_alias"
            />
          }
          width={125}
        />
      );
    }
  };

  static renderTables = (name, item, tableProps) => {
    return (
      <div key={name}>
        <h4>{name}</h4>
        <Table
          key={item.name + '_table'}
          rowsCount={item.length}
          rowHeight={50}
          headerHeight={50}
          width={850}
          maxHeight={500}
        >
          <Column
            key={item.name + '_summary'}
            header={<Cell>Summary</Cell>}
            cell={
              <TableSummaryCell data={item} field="contribution_description" />
            }
            width={tableProps.summaryWidth}
          />
          <Column
            key={item.name + '_url'}
            header={<Cell>Context URL</Cell>}
            cell={<TableLinkCell data={item} field="contribution_url" />}
            width={75}
          />
          <Column
            key={item.name + '_submission_date'}
            header={<Cell>Submission Date</Cell>}
            cell={
              <TableDateCell data={item} field="contribution_submission_date" />
            }
            width={100}
          />
          <Column
            key={item.name + '_approval_status'}
            header={<Cell>Approval Status</Cell>}
            cell={
              <TableApprovalStatusCell data={item} field="approval_status" />
            }
            width={100}
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
            width={100}
          />
          {tableProps.contributor ? (
            ContributionsTable.contributorEntry(item, tableProps.contributor)
          ) : (
            <div />
          )}
        </Table>
        <br />
      </div>
    );
  };

  getTable = arrayList => {
    if (arrayList.length === 0) {
      return <h4>No contributions found</h4>;
    } else {
      return this.state.tables.get(this.state.selectedProject);
    }
  };

  render() {
    const newList = this.state.projectNames.filter(name => {
      return name.toLowerCase().indexOf(this.state.search) > -1;
    });
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
            <input
              type="text"
              id="projectLISearch"
              className="form-control"
              onInput={this.storeSearch}
              placeholder="Search projects"
            />
            <div id="projectSearchResults" className="list-group mt-1">
              {newList.map((name, i) => (
                <a
                  key={i}
                  href="#"
                  className="list-group-item list-group-item-action"
                  onClick={this.updateSelectedProject(name)}
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
          <div className="col-sm-9">
            {this.state.selectedProject ? (
              this.getTable(newList)
            ) : (
              <p>Search for and select a project to see contributions.</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state, props: OwnProps) => ({
  ...props,
}))(ContributionsTable);
