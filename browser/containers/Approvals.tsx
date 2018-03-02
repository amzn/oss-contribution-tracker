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

import * as ContributionsActions from '../modules/contributions';

interface Props {
  dispatch: any;
  params: any;
}

interface State {
  approvalStatus: string;
}

class Approvals extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      approvalStatus: null,
    };
  }

  handleApproval = (e) => {
    const { dispatch } = this.props;
    let field = e.target.elements;
    e.preventDefault();

    // dispatch to server
    dispatch(ContributionsActions.approveContribution({
      approvalNotes: field.approvalNotes.value,
      approvalStatus: this.state.approvalStatus,
      contributionId: (this.props as any).match.params.contrib_id,
    }));
  }

  approveContrib = (e) => {
    this.setState({
      approvalStatus: 'approved',
    });
    (document.getElementById('approveBtn') as any).disabled = true;
    (document.getElementById('denyBtn') as any).disabled = false;
  }

  denyContrib = (e) => {
    this.setState({
      approvalStatus: 'denied',
    });
    (document.getElementById('approveBtn') as any).disabled = false;
    (document.getElementById('denyBtn') as any).disabled = true;
  }

  render() {
    return (
      <form onSubmit={this.handleApproval}>
        <div className="form-group">
          <label>Approve/Deny</label>
          <br/>
          <div className="btn-group" role="group" aria-label="...">
            <button id="approveBtn" type="button" className="btn btn-success btn-sm active" onClick={this.approveContrib}>
              <i className="fa fa-check" />
            </button>
            <button id="denyBtn" type="button" className="btn btn-danger btn-sm active" onClick={this.denyContrib}>
              <i className="fa fa-ban" />
            </button>
          </div>
          <br/>
          <label>Approval Notes</label> <br/>
          <textarea className="form-control" rows={3} name="approvalNotes" required /> <br/>
        </div>
        <div className="col-md-10">
          <div className="pullRight">
            <Link className="btn btn-secondary" to="/admin">Cancel</Link>
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>
    );
  }
}

export default connect(state => {
  return{};
})(Approvals);