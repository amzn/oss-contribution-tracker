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
    const contribId = entry.contribution_id.toString();
    const url = event.currentTarget.url.value.trim();

    try {
      await dispatch(ContributionsActions.updateGithubLink({
        contrib_id: contribId,
        link: url,
        user: this.state.user,
      }));
      const list = this.state.contributionList;
      delete list[contribId];
      this.setState({
        contributionList: this.state.contributionList,
      });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      const getAlert = () => (
        <SweetAlert title="Failure to update link" onConfirm={this.hideAlertRedirect}>
          Unable to save your contribution link. Please contact your site administrator.
        </SweetAlert>
      );
      this.setState({
        alert: getAlert(),
      });
    }
  }

  renderTable = () => {
    const display = [];
    for (const key of Object.keys(this.state.contributionList)) {
      const value = this.state.contributionList[key];
      if (!value.contribution_url) {
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
      }
    }
    return display;
  }

  render() {
    const tables = this.renderTable();
    return (
      <div className="container">
        <div className="row">
          <div id="github-link-container" className="col-lg-12"><br/><br/>
            <h3>Your contributions awaiting links</h3>
            { this.state.alert }
            <table className="table table-striped table-bordered mt-3">
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
      </div>
    );
  }
}

export default connect((state) => ({}))(GithubLink) as any; // hacky and I need to fix the redux stuff
