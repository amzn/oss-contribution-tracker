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
import { Link } from 'react-router';

import ErrorModal from '../components/ErrorModal';
import { setGeneralError } from '../modules/common';

interface Props {
  children: any;
  dispatch: any;
  generalError: any;
}

interface State {
  user: {
    name: string;
    groups: string;
    ossApproved: boolean;
  };
}


class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      user: {
          name: '',
          groups: '',
          ossApproved: false,
        },
    };
  };

  dismissError = () => {
    const { dispatch } = this.props;
    dispatch(setGeneralError(null));
  }

  mapError = (err) => {
    let dismissError = this.dismissError.bind(this);

    if (err.code === 403) {
      return (<ErrorModal
        message={err.message}
        onDismiss={dismissError}
        title="You might not have access to this resource"
        explain="If you think you need access to this item, contact your administrators."
      />);
    }
    return (<ErrorModal
      message={err.message}
      onDismiss={dismissError}
      title="Something went wrong"
      explain="Please try that again."
    />);
  }


  render() {
    const { generalError } = this.props;
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">OSS Contribution Tracker</a>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/contribute">New Contribution</Link>
              </li>
              <li>
                <Link to="/list">Contributions By Project</Link>
              </li>
              <li>
                <Link to="/employee">Contributions By User</Link>
              </li>
              <li>
                <a target="_blank" href="https://github.com/amzn/oss-contribution-tracker/issues">
                  <span className="glyphicon glyphicon-question-sign" /> Help
                </a>
              </li>
            </ul>
          </div>
        </nav>

        { generalError != null ? this.mapError(generalError) : '' }

        <div id="body-content">
          {this.props.children}
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-10">
              <hr/>
              <a href="https://github.com/amzn/oss-contribution-tracker">GitHub</a> | <a href="https://github.com/amzn/oss-contribution-tracker/blob/master/LICENSE">License Information</a>
            </div>
          </div>
        </div>
      </div>

    );
  }

}

export default connect(state => state.common)(App);