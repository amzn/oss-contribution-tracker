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
import SweetAlert from 'react-bootstrap-sweetalert';
import { connect } from 'react-redux';
import Select from 'react-select';

import * as actions from '../actions/strategicActions';

interface Props {
  addNewProject: any;
  updateAdminNav: any;
}

interface State {
  name: string;
  url: string;
  license: string;
  verified: boolean;
  alert: any;
}

class ProjectForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      url: '',
      license: '',
      verified: null,
      alert: null,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const fields = e.target.elements;

    const jsonObj = {
      project_name: fields.name.value,
      project_url: fields.url.value,
      project_license: fields.license.value,
      project_verified: fields.verified.value,
    };

    this.props.addNewProject(jsonObj, this.alert);
  };

  handleVerifiedChange = value => {
    this.setState({ verified: value });
  };

  alert = result => {
    if (result === 'exists') {
      this.setState({
        alert: (
          <SweetAlert
            warning={true}
            title="Already exists"
            onConfirm={this.hideAlert}
          >
            This project already exists
          </SweetAlert>
        ),
      });
    } else {
      this.setState({
        alert: (
          <SweetAlert
            success={true}
            title="Success!"
            onConfirm={this.hideAlert}
          >
            New project has been added
          </SweetAlert>
        ),
      });
    }
  };

  hideAlert = () => {
    this.setState({ alert: null });
    this.props.updateAdminNav(null);
  };

  handleCancel = () => {
    this.props.updateAdminNav(null);
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <form id="contributions-form" onSubmit={this.handleSubmit}>
              <h3>New Project</h3>
              <br />
              <div className="form-group">
                <label>Project name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>Project URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="url"
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>Project license</label>
                <input
                  type="text"
                  className="form-control"
                  name="license"
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>Is the project verified?</label>
                <Select
                  name="verified"
                  options={[
                    { label: 'True', value: true },
                    { label: 'False', value: false },
                  ]}
                  onChange={this.handleVerifiedChange}
                  required={true}
                  openOnFocus={true}
                  value={this.state.verified}
                />
              </div>
              <button className="btn btn-secondary" onClick={this.handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
        {this.state.alert}
      </div>
    );
  }
}

export default connect(null, actions)(ProjectForm);
