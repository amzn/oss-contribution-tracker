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
import Select from 'react-select';

import * as ContributionsActions from '../modules/contributions';

interface OwnProps {
  approvers: any;
  projects: any;
}

interface Props extends OwnProps {
  dispatch: any;
}

interface State {
  package: string;
  description: string;
  date: string;
  project: string;
  approver: string;
  projectDisabled: boolean;
  githubLink: string;
}

class ContributionsForm extends React.Component<Partial<Props>, State> {
  constructor(props) {
    super(props);
    this.state = {
      package: '',
      description: '',
      date: '',
      project: 'Select Project',
      approver: 'Select Approver',
      projectDisabled: false,
      githubLink: '',
    };
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    const field = e.target.elements;
    e.preventDefault();
    let projectName = '';
    let needsProjectReview = false;
    if (this.state.projectDisabled) {
      projectName = field.newProjectName.value;
      needsProjectReview = true;
    } else {
      projectName = field.projectName.value;
    }

    // dispatch to server
    dispatch(ContributionsActions.addContribution({
      package: projectName.toLowerCase(),
      description: field.fixDescription.value.toLowerCase(),
      date: field.dateSelected.value.toLowerCase(),
      approver: field.approverName.value.toLowerCase(),
      contributor: field.contributorName.value.toLowerCase(),
      needsProjectReview,
      githubLink: field.githubLink.value.toLowerCase(),
    }));
  }

  approverList = (e?: any) => {
    if (this.props.approvers) {
      const approvers = this.props.approvers;
      return approvers.map((listValue) => {
          return {
            label: listValue.approver_name ? listValue.approver_name : listValue.approver_alias,
            value: listValue.approver_id,
          };
        },
      );
    }
  }

  projectList = (e?: any) => {
    // check for length as this can return an empty object
    if (this.props.projects.length) {
      const projects = this.props.projects;
      return projects.map((listValue) => {
          return { label: listValue.project_name, value: listValue.project_id};
        },
      );
    }
  }

  handleApproverChange = (e) => {
    this.setState({approver: e});
  }

  handleProjectChange = (e) => {
    this.setState({project: e});
  }

  toggleProjectSelect = (e) => {
    this.setState({
      projectDisabled: e.target.checked,
    });
  }

  render() {
    const approverOptions = this.approverList();
    const projectOptions = this.projectList();
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <form id="contributions-form" onSubmit={this.handleSubmit}>
              <h3>New Contribution</h3>
              <div className="form-group">
                <label>Project name</label>
                <Select
                  name="projectName"
                  placeholder="Select Project"
                  options={projectOptions}
                  onChange={this.handleProjectChange}
                  value={this.state.project}
                  disabled={this.state.projectDisabled}
                  required={true}
                  menuContainerStyle={{ zIndex: 5 }}
                  openOnFocus={true}
                />
                <div className="input-group mt-1">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <input type="checkbox" id="newProject"
                        className="ml-0 mr-1"
                        checked={this.state.projectDisabled}
                        onChange={this.toggleProjectSelect} />
                      <label htmlFor="newProject" className="form-check-label">
                        New Project
                      </label>
                    </span>
                  </div>
                  <input id="new-project-text" type="text" className="form-control"
                    name="newProjectName" disabled={!this.state.projectDisabled} required />
                </div>
              </div>

              <div className="form-group">
                <label>Description of fix</label>
                <textarea id="fixDescription" className="form-control" rows={3} name="fixDescription" required />
              </div>

              <div className="form-group">
                <label>Contribution date</label>
                <input type="date" className="form-control" name="dateSelected" required/>
              </div>

              <div className="form-group">
                <label>BFA/IP approver</label>
                <Select
                  name="approverName"
                  placeholder="Select Approver"
                  options={approverOptions}
                  onChange={this.handleApproverChange}
                  value={this.state.approver}
                  required
                  menuContainerStyle={{ zIndex: 4 }}
                  openOnFocus={true}
                />
              </div>

              <div className="form-group">
                <label>Contributor alias</label>
                <input type="text" className="form-control" name="contributorName" required />
              </div>

              <div className="form-group">
                <label>Contribution Link (optional)</label>
                <input type="text" className="form-control" name="githubLink" />
              </div>
              <Link className="btn btn-secondary" id="to-home" to="/">Cancel</Link>
              <button className="btn btn-primary" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state, props: OwnProps) => ({
  ...props,
}))(ContributionsForm);
