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
import DatePicker = require('react-bootstrap-date-picker');
import { IndexLink } from 'react-router';
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
      date: new Date().toISOString(),
      project: 'Select Project',
      approver: 'Select Approver',
      projectDisabled: false,
      githubLink: '',
    };
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    let field = e.target.elements;
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
      needsProjectReview: needsProjectReview,
      githubLink: field.githubLink.value.toLowerCase(),
    }));
  }

  approverList = (e?: any) => {
    if (this.props.approvers) {
      let approvers = this.props.approvers;
      return approvers.map(listValue => {
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
      let projects = this.props.projects;
      return projects.map(listValue => {
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
    let elm = document.getElementById('new-project-text') as HTMLInputElement;
    elm.disabled = this.state.projectDisabled;
  }

  render() {
    let approverOptions = this.approverList();
    let projectOptions = this.projectList();
    return (
      <div>
        <h3>New Contributions</h3>
        <form id="contributions-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Project name</label>
            <br/>
            <Select
              name="projectName"
              placeholder="Select Project"
              options={projectOptions}
              onChange={this.handleProjectChange}
              value={this.state.project}
              disabled={this.state.projectDisabled}
              required
              menuContainerStyle={{ zIndex: 5 }}
              openOnFocus={true}
            />
            <div className="input-group">
              <span className="input-group-addon">
                <input type="checkbox" className="checkbox-control" checked={this.state.projectDisabled} onChange={this.toggleProjectSelect}/>
                <span className="checkbox-label"> New Project</span>
              </span>
              <input id="new-project-text" type="text" className="form-control" name="newProjectName" disabled required style={{'position' : 'static'}}/>
            </div>
            <label>Description of fix</label> <br/>
            <textarea id="fixDescription" className="form-control" rows={3} name="fixDescription" required></textarea> <br/>
            <label>Contribution date</label> <br/>
            <DatePicker name="dateSelected" value={this.state.date}/>
            <label>BFA/IP approver</label> <br/>
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
            <label>Contributor alias</label> <br/>
            <input type="text" className="form-control" name="contributorName" required/>
            <label>GitHub Link (optional)</label>
            <input type="text" className="form-control" name="githubLink"/>
            <br/>
          </div>
          <div className="col-md-10">
            <div className="pullRight">
              <IndexLink className="btn btn-default" to="/">Cancel</IndexLink>
              <button className="btn btn-default" type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect((state, props: OwnProps) => ({
  ...props,
}))(ContributionsForm);