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
import ReactTable from 'react-table';
import * as utils from '../util/exportCsv';

import TableApprovalStatusCell from '../components/TableApprovalStatusCell';
import TableEditCell from '../components/TableEditCell';
import TableLinkCell from '../components/TableLinkCell';

interface Props {
  contributionList: any;
}

interface State {
  contributionList: any;
}

export default class EditContributionTable extends React.Component<
  Props,
  State
> {
  constructor(props) {
    super(props);
    this.state = {
      contributionList: [],
    };
  }

  componentWillMount() {
    const { contributionList } = this.props;
    this.setState({
      contributionList,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      contributionList: nextProps.contributionList,
    });
  }

  csvDownload = () => {
    utils.onClickDownload(this.state.contributionList);
  };

  render() {
    return (
      <div key="contribution_edit_div" id="edit_contributions_admin_link">
        <ReactTable
          data={this.state.contributionList}
          columns={[
            {
              Header: <strong>Edit</strong>,
              accessor: 'contribution_id',
              width: 50,
              Cell: row => <TableEditCell type="contribution" id={row.value} />,
            },
            {
              Header: <strong>Project</strong>,
              accessor: 'project_name',
            },
            {
              Header: <strong>Summary</strong>,
              accessor: 'contribution_description',
            },
            {
              Header: <strong>Contrib URL</strong>,
              accessor: 'contribution_url',
              width: 85,
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
              Header: <strong>GitHub Status</strong>,
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
          filterable={true}
        />
        <br />
        <button onClick={this.csvDownload} className="btn btn-secondary">
          <i className="fa fa-download" /> Download CSV
        </button>
      </div>
    );
  }
}
