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
import Select from 'react-select';
import ReactTable from 'react-table';

import TableApprovalStatusCell from '../components/TableApprovalStatusCell';
import TableLinkCell from '../components/TableLinkCell';

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
}

class ContributionsTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      tables: new Map(),
      projectNames: new Array(),
      selectedProject: null,
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

  storeSearch = e => {
    this.setState({
      selectedProject: e.value,
    });
  };

  static renderTables = (name, item, tableProps) => {
    return (
      <div key={name}>
        <h4>Project {name}</h4>
        <ReactTable
          data={item}
          columns={[
            {
              Header: <strong>Summary</strong>,
              accessor: 'contribution_description',
            },
            {
              Header: <strong>Commit URL </strong>,
              accessor: 'contribution_url',
              Cell: row => <TableLinkCell link={row.value} />,
            },
            {
              Header: <strong>Submission Date</strong>,
              id: 'contribution_submission_date',
              accessor: d => d.contribution_submission_date.slice(0, 10),
            },
            {
              Header: <strong>Approval Status</strong>,
              accessor: 'approval_status',
              Cell: row => (
                <TableApprovalStatusCell approval_status={row.value} />
              ),
            },
            {
              Header: <strong>Github Status</strong>,
              accessor: 'contribution_github_status',
              Cell: row => (
                <TableApprovalStatusCell approval_status={row.value} />
              ),
            },
            {
              Header: <strong>Contributor Alias</strong>,
              accessor: 'contributor_alias',
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  };

  getProcessedList(projectList) {
    return projectList.map(value => {
      return {
        label: value,
        value,
      };
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <Select
          id="projectLISearch"
          placeholder="Search projects"
          options={this.getProcessedList(this.state.projectNames)}
          onChange={this.storeSearch}
          menuContainerStyle={{ zIndex: 4 }}
          openOnFocus={true}
        />
        <div className="mt-2">
          {this.state.selectedProject ? (
            this.state.tables.get(this.state.selectedProject)
          ) : (
            <p className="text-muted">
              Search for and select a project to see contributions.
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default connect((state, props: OwnProps) => ({
  ...props,
}))(ContributionsTable);
