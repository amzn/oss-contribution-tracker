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
import { Link } from 'react-router-dom';

interface Props {
}

interface State {
}

export default class ApproveDenyForm extends React.Component<Props, State> {
  handleApproval = () => {
    // TODO: nothing here yet but will implement later.
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleApproval}>
          <div className="form-group">
            <label>Approval Notes</label> <br/>
            <textarea className="form-control" rows={3} name="approvalNotes" required></textarea> <br/>
          </div>
          <div className="col-md-10">
            <div className="pullRight">
              <Link className="btn btn-secondary" to="/admin">Cancel</Link>
              <button className="btn btn-primary" type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}