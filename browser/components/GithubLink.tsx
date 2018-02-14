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

import SweetAlert from 'react-bootstrap-sweetalert';

import * as ContributionsActions from '../modules/contributions';

interface Props {
  dispatch: any;
  contributionList: object;
  user: string;
}

interface State {
  user: string;
  contributionList: object;
  alert?: any;
}

class GithubLink extends React.Component<Partial<Props>, State> {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      contributionList: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      contributionList: nextProps.contributionList,
      user: nextProps.user,
    });
  }

  componentWillMount() {
    this.setState({
      contributionList: this.props.contributionList,
      user: this.props.user,
    });
  }

  hideAlertRedirect = () => {
    this.setState({
      alert: null,
    });
  }

  handleLinkSubmit = async (event, entry) => {
    event.preventDefault();
    const { dispatch } = this.props;
    const contrib_id = entry.contribution_id.toString();
    const url = event.currentTarget.url.value.trim();
    const rtn = await dispatch(ContributionsActions.updateGithubLink({
      contrib_id: contrib_id,
      link: url,
      user: this.state.user,
    }));
    if (rtn.status === 200) {
      let list = this.state.contributionList;
      delete list[contrib_id];
      this.setState({
        contributionList: this.state.contributionList,
      });
    } else {
      const getAlert = () => (
        <SweetAlert title="Failure to update link" onConfirm={this.hideAlertRedirect}>
          Unable to save contribution link. If this problem persists, contact osa-pm@amazon.com.
        </SweetAlert>
      );
      this.setState({
        alert: getAlert(),
      });
    };
  }

  renderTable = () => {
    const display = [];
    for (const key of Object.keys(this.state.contributionList)) {
      const value = this.state.contributionList[key];
      let status, commitUrl;
      status = value.approval_status;
      commitUrl = value.contribution_commit_url;
      if (status === 'approved' && (commitUrl == null || commitUrl.length === 0)) {
        display.push(
          <tr key={value.contribution_id}>
            <td>{value.project_name}</td>
            <td>{value.contribution_description}</td>
            <td>
              <form className="form-inline" onSubmit={(e) => this.handleLinkSubmit(e, value)} style={{display: 'flex'}}>
                <input name="url" type="text" className="form-control" style={{flex: '1 0 auto'}} />
                <button type="submit" className="btn btn-success">
                  Save <span className="glyphicon glyphicon-ok" />
                </button>
              </form>
            </td>
          </tr>,
        );
      };
    };
    return display;
  }

  render() {
    let tables = this.renderTable();
    return (
      <div className="row">
        <div id="github-link-container" className="col-md-10 col-md-offset-1"><br/><br/>
          <h3>Your contributions awaiting links</h3>
          { this.state.alert }
          <table className="table table-striped table-bordered">
            <thead>
              <tr key="github-link-table-head">
                <th>Project</th>
                <th>Description</th>
                <th>Contribution Link</th>
              </tr>
            </thead>
            <tbody>
              {tables}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(state => ({}))(GithubLink) as any; // hacky and I need to fix the redux stuff