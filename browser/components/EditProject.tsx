/* Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
import Select from 'react-select';
import { postJSON, reqJSON } from '../util/index';

interface Props {
  groupList: [
    {
      goal: string;
      group_id: number;
      group_name: string;
      contribMTD: number;
      contribMonth: number;
      contribWeek: number;
      contribYear: number;
      numGroups: number;
      numUsers: number;
      projects: number[];
      sponsor: string;
    }
  ];
  project: string;
}

interface State {
  alert: any;
  groupList: [
    {
      goal: string;
      group_id: number;
      group_name: string;
      contribMTD: number;
      contribMonth: number;
      contribWeek: number;
      contribYear: number;
      numGroups: number;
      numUsers: number;
      projects: number[];
      sponsor: string;
    }
  ];
  projectGroups: string;
  projectID: number;
  projectInfo?: {
    groups: [
      {
        contribMTD: number;
        contribMonth: number;
        contribWeek: number;
        contribYear: number;
        goal: string;
        group_id: number;
        group_name: string;
        projects: number[];
        sponsor: string;
      }
    ];
    project: {
      project_auto_aprovable: boolean;
      project_id: number;
      project_is_org: boolean;
      project_license: string;
      project_name: string;
      project_url: string;
      project_verified: boolean;
    };
    users: [
      {
        company_alias: string;
        contribMTD: number;
        contribMonth: number;
        contribWeek: number;
        contribYear: number;
        github_alias: string;
      }
    ];
  };
  projectLicense: string;
  projectName: string;
  projectURL: string;
  projectUsers: string;
}

export default class EditProject extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      projectGroups: '',
      projectID: null,
      projectInfo: null,
      projectLicense: '',
      projectName: '',
      projectURL: '',
      projectUsers: '',
      groupList: null,
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      const projectInfo = await this.getProject();
      const projectGroups = [];
      for (const group of projectInfo.groups) {
        projectGroups.push(group.group_id);
      }
      const projectUsers = [];
      let projectDetails = {
        project_id: null,
        project_license: null,
        project_name: null,
        project_url: null,
      };
      if (projectInfo) {
        projectDetails = projectInfo.project;
        for (const user of projectInfo.users) {
          projectUsers.push(user.company_alias);
        }
      }
      this.setState({
        projectGroups: projectGroups.join(','),
        projectID: projectDetails.project_id || '',
        projectInfo,
        projectLicense: projectDetails.project_license || '',
        projectName: projectDetails.project_name || '',
        projectURL: projectDetails.project_url || '',
        projectUsers: projectUsers.join(','),
      });
    }
  }

  getProject = async () => {
    if (this.props.project) {
      return await reqJSON(`/api/strategic/projects/${this.props.project}`);
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    const projectIsGHOrg = e.target.elements.project_is_org.checked;
    let projectURL = this.state.projectURL;
    if (projectIsGHOrg && projectURL.startsWith('https://github.com/')) {
      projectURL = projectURL.slice(0, 19) + projectURL.slice(19).split('/')[0];
    }
    const data = {
      project_groups: this.state.projectGroups,
      project_license: this.state.projectLicense,
      project_name: this.state.projectName,
      project_id: this.state.projectID,
      project_is_org: projectIsGHOrg,
      project_url: projectURL,
      project_users: this.state.projectUsers,
    };

    await postJSON(`/api/strategic/projects/update`, data);
    this.alert();
  };

  handleNameChange = e => {
    this.setState({
      projectName: e.target.value,
    });
  };

  handleURLChange = e => {
    this.setState({
      projectURL: e.target.value,
    });
  };

  handleLicenseChange = e => {
    this.setState({
      projectLicense: e.target.value,
    });
  };

  handleGroupChange = e => {
    this.setState({
      projectGroups: e,
    });
  };

  handleUserChange = e => {
    this.setState({
      projectUsers: e,
    });
  };

  groupList = () => {
    if (this.props.groupList.length) {
      const groups = this.props.groupList;
      return groups.map(listValue => {
        return { label: listValue.group_name, value: listValue.group_id };
      });
    }
  };

  handleCancel = () => {
    this.setState({
      projectInfo: null,
    });
  };

  alert = () => {
    this.setState({
      alert: (
        <SweetAlert success={true} title="Success!" onConfirm={this.hideAlert}>
          Project {this.state.projectInfo.project.project_name} has been
          updated!
        </SweetAlert>
      ),
    });
  };

  hideAlert = () => {
    this.setState({
      alert: null,
      projectInfo: null,
    });
  };

  handleGitHubOrgCheckbox = e => {
    const target = e.target;
    const projectInfo = this.state.projectInfo;
    projectInfo.project.project_is_org = target.checked;
    this.setState({
      projectInfo,
    });
  };

  render() {
    if (this.state.projectInfo) {
      const groupsSelect = this.groupList();
      return (
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <form id="user-form" onSubmit={this.handleSubmit}>
                <h3>Edit Project Details</h3>
                <br />
                <div className="form-group">
                  <label>Project name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="project_name"
                    required={true}
                    value={this.state.projectName}
                    onChange={this.handleNameChange}
                  />
                </div>

                <div className="form-group">
                  <label>Project URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="project_url"
                    required={true}
                    value={this.state.projectURL}
                    onChange={this.handleURLChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    id="project_is_org_checkbox"
                    type="checkbox"
                    name="project_is_org"
                    value="project_is_org"
                    onChange={this.handleGitHubOrgCheckbox}
                    checked={this.state.projectInfo.project.project_is_org}
                  />
                  <label className="form-check-label">Is GitHub Org?</label>
                </div>

                <div className="form-group">
                  <label>Project license</label>
                  <input
                    type="text"
                    className="form-control"
                    name="project_license"
                    required={true}
                    value={this.state.projectLicense}
                    onChange={this.handleLicenseChange}
                  />
                </div>

                <label>Project group(s)</label>
                <Select
                  name="project_groups"
                  placeholder="Select Group(s)"
                  options={groupsSelect}
                  onChange={this.handleGroupChange}
                  required={true}
                  openOnFocus={true}
                  multi={true}
                  simpleValue={true}
                  value={this.state.projectGroups}
                />

                <br />
                <hr />
                <button
                  className="btn btn-secondary"
                  onClick={this.handleCancel}
                >
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
    } else {
      return <div />;
    }
  }
}
