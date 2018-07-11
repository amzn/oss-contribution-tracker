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
  params: any;
  fetchGroup: any;
  fetchGroups: any;
  fetchProjects: any;
  fetchUsers: any;
  updateGroup: any;
  deleteGroup: any;
  group: any;
  projects: any;
  users: any;
  groupId: any;
  updateAdminNav: any;
}

interface State {
  name: string;
  goal: string;
  sponsor: string;
  projects: any;
  users: any;
  alert: any;
}

class EditGroup extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      goal: '',
      sponsor: '',
      projects: [],
      users: [],
      alert: null,
    }
  }

  componentDidMount() {
    this.props.fetchGroup(this.props.groupId);
    this.props.fetchProjects();
    this.props.fetchUsers();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      const projects = [];
      for (const proj of this.props.group.projects) {
        projects.push(proj.project_id);
      }
      const users = [];
      for (const user of this.props.group.users) {
        users.push(user.amazon_alias);
      }
      this.setState({
        name: this.props.group.group.group_name ? this.props.group.group.group_name : '',
        goal: this.props.group.group.goal ? this.props.group.group.goal : '',
        sponsor: this.props.group.group.sponsor ? this.props.group.group.sponsor : '',
        projects: projects.join(','),
        users: users.join(',')
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const fields = e.target.elements;
    const projects = [];
    const users = [];
    if (fields.projectList.length > 1) {
      for (const project of fields.projectList) {
        projects.push(parseInt(project.value, 10));
      }
    } else {
      projects.push(parseInt(fields.projectList.value, 10));
    }
    if (fields.userList.length > 1) {
      for (const user of fields.userList) {
        users.push(user.value);
      }
    } else {
      users.push(fields.userList.value);
    }


    const jsonObj = {
      groupId: this.props.group.group.group_id,
      groupName: fields.groupName.value,
      sponsorName: fields.sponsorName.value,
      goals: fields.groupGoals.value,
      projects,
      users
    };

    this.props.updateGroup(jsonObj, this.alert);
  };

  userList = () => {
    if (this.props.users.length) {
      const users = this.props.users;
      return users.map(listValue => {
        return {label: listValue.amazon_alias, value: listValue.amazon_alias};
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

  handleNameChange = (e) => {
    this.setState({name: e.target.value});
  };

  handleGoalChange = (e) => {
    this.setState({goal: e.target.value});
  };

  handleSponsorChange = (e) => {
    this.setState({sponsor: e.target.value});
  };

  handleUserChange = (value) => {
    this.setState({users: value});
  };

  handleProjectChange = (value) => {
    this.setState({projects: value});
  };

  handleDelete = (e) => {
    e.preventDefault();
    const getDeleteAlert = () => (
      <SweetAlert
        warning={true}
        showCancel={true}
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title="Are you sure? There's no coming back."
        onConfirm={() => this.deleteGroup()}
        onCancel={() => this.hideAlert()}
      >
        This entry will be deleted!
      </SweetAlert>
    );
    this.setState({
      alert: getDeleteAlert(),
    });
  };

  deleteGroup = () => {
    this.props.deleteGroup({id: this.props.group.group.group_id}, this.alert);
  };

  alert = (message) => {
    this.setState({
      alert: (<SweetAlert
        success={true}
        title="Success!"
        onConfirm={this.hideAlert}
      >
        Group has been {message}
      </SweetAlert>)
    });
  };

  hideAlert = () => {
    this.setState({ alert: null });
    this.props.fetchGroups();
    this.props.updateAdminNav('viewGroup');
  }

  handleCancel = () => {
    this.props.fetchGroups();
    this.props.updateAdminNav('viewGroup');
  }

  render() {
    const userOptions = this.userList();
    const projectOptions = this.projectList();
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <form id="contributions-form" onSubmit={this.handleSubmit}>
              <h3>Edit Group</h3>
              <br/>
              <div className="form-group">
                <label>Group name</label>
                <input
                  type="text"
                  className="form-control"
                  name="groupName"
                  required={true}
                  value={this.state.name}
                  onChange={this.handleNameChange}
                />
              </div>
              <div className="form-group">
                <label>Sponsor name</label>
                <input
                  type="text"
                  className="form-control"
                  name="sponsorName"
                  required={true}
                  value={this.state.sponsor}
                  onChange={this.handleSponsorChange}
                />
              </div>
              <div className="form-group">
                <label>Group goals</label>
                <textarea
                  className="form-control"
                  rows={3}
                  name="groupGoals"
                  required={true}
                  value={this.state.goal}
                  onChange={this.handleGoalChange}
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
                  placeholder="Select Project"
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
              <button className="btn btn-danger" onClick={this.handleDelete}>
                Delete
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

const mapStateToProps = state => (
  {
    group: state.groups.group,
    projects: state.projects.all,
    users: state.users.all,
    groupId: state.admin.group,
  }
);

export default connect(mapStateToProps, actions)(EditGroup);
