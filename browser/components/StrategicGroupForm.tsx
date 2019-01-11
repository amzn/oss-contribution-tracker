/* Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
  fetchProjects: () => void;
  fetchUsers: () => void;
  fetchGroups: () => void;
  addNewGroup: (group) => void;
  projects: Array<{
    project_id: number;
    project_name: string;
    project_url: string;
    project_license: string;
    project_verified: boolean;
    project_auto_approvable: boolean;
  }>;
  users: Array<{
    company_alias: string;
    github_alias: string;
    groups: any; // format of group id mapping to date string
  }>;
  updateAdminNav: (navpage) => void;
}

interface State {
  name: string;
  goals: string;
  sponsor: string;
  projects: number[];
  users: string[];
  alert: JSX.Element;
}

class GroupForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      goals: '',
      sponsor: '',
      projects: [],
      users: [],
      alert: null,
    };
  }

  componentDidMount() {
    this.props.fetchProjects();
    this.props.fetchUsers();
  }

  handleSubmit = async e => {
    e.preventDefault();
    const fields = e.target.elements;
    const projects = [];
    const users = [];

    // puts selected projects in list format with the specific values from the form
    if (fields.projectList.length > 1) {
      for (const project of fields.projectList) {
        projects.push(parseInt(project.value, 10));
      }
    } else {
      projects.push(parseInt(fields.projectList.value, 10));
    }

    // puts selected users in list format with the specific values from the form
    if (fields.userList.length > 1) {
      for (const user of fields.userList) {
        users.push(user.value);
      }
    } else {
      users.push(fields.userList.value);
    }

    const jsonObj = {
      groupName: fields.groupName.value,
      sponsorName: fields.sponsorName.value,
      goals: fields.groupGoals.value,
      projects,
      users,
    };

    await this.props.addNewGroup(jsonObj);
    this.alert();
  };

  userList = () => {
    if (this.props.users.length) {
      const users = this.props.users;
      return users.map(listValue => {
        return {
          label: listValue.company_alias,
          value: listValue.company_alias,
        };
      });
    }
  };

  projectList = () => {
    if (this.props.projects.length) {
      const projects = this.props.projects;
      return projects.map(listValue => {
        return { label: listValue.project_name, value: listValue.project_id };
      });
    }
  };

  handleUserChange = value => {
    this.setState({ users: value });
  };

  handleProjectChange = value => {
    this.setState({ projects: value });
  };

  alert = () => {
    this.setState({
      alert: (
        <SweetAlert success={true} title="Success!" onConfirm={this.hideAlert}>
          New group has been added
        </SweetAlert>
      ),
    });
  };

  hideAlert = () => {
    this.setState({ alert: null });
    this.props.fetchGroups();
    this.props.updateAdminNav('viewGroup');
  };

  handleCancel = () => {
    this.props.updateAdminNav(null);
  };

  render() {
    const userOptions = this.userList();
    const projectOptions = this.projectList();
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <form id="contributions-form" onSubmit={this.handleSubmit}>
              <h3>New Group</h3>
              <br />
              <div className="form-group">
                <label>Group name</label>
                <input
                  type="text"
                  className="form-control"
                  name="groupName"
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>Sponsor name</label>
                <input
                  type="text"
                  className="form-control"
                  name="sponsorName"
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>Group goals</label>
                <textarea
                  className="form-control"
                  rows={3}
                  name="groupGoals"
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>Projects</label>
                <Select
                  name="projectList"
                  placeholder="Select Project"
                  options={projectOptions}
                  onChange={this.handleProjectChange}
                  required={true}
                  openOnFocus={true}
                  multi={true}
                  simpleValue={true}
                  value={this.state.projects}
                />
              </div>

              <div className="form-group">
                <label>Users</label>
                <Select
                  name="userList"
                  placeholder="Select User"
                  options={userOptions}
                  onChange={this.handleUserChange}
                  required={true}
                  openOnFocus={true}
                  multi={true}
                  simpleValue={true}
                  value={this.state.users}
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

const mapStateToProps = state => ({
  projects: state.projects.all,
  users: state.users.all,
});

export default connect(
  mapStateToProps,
  actions
)(GroupForm);
