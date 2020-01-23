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
import * as QS from 'query-string';
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { reqJSON } from '../util/index';

import { PulseLoader } from 'halogenium';

import ApprovalsTable from '../components/ApprovalsTable';
import CCLAForm from '../components/CCLAForm';
import CLATable from '../components/CLATable';
import EditContributionTable from '../components/EditContributionTable';
import EditGroup from '../components/EditGroup';
import GroupsTable from '../components/GroupsTable';
import ProjectForm from '../components/ProjectForm';
import GroupForm from '../components/StrategicGroupForm';
import UserForm from '../components/UserForm';
import ViewProject from '../components/ViewProject';
import ViewUser from '../components/ViewUser';

import * as actions from '../actions/strategicActions';

import ExtensionPoint from '../util/ExtensionPoint';

interface Props {
  alert: any;
  nav: string;
  group: number;
  updateAdminNav: any;
  updateAdminGroup: any;
  groupId?: string;
  groups: any;
  fetchGroup: any;
  fetchGroups: any;
  location: any;
  dispatch: any;
}

interface State {
  approvalList: any;
  contributionList: any;
  userList: any[];
  user: any;
  key: number;
  claTable: any;
  claProjectNames: any[];
  project_direct: boolean;
  project_id: number;
  projectList: [
    {
      contribMTD: number;
      contribMonth: number;
      contribWeek: number;
      contribYear: number;
      numGroups: number;
      numUsers: number;
      project_auto_aprovable: boolean;
      project_id: number;
      project_license: string;
      project_name: string;
      project_url: string;
      project_verified: boolean;
    }
  ];
}

class Admin extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      approvalList: new Array(),
      contributionList: new Array(),
      user: '',
      userList: new Array(),
      key: 0,
      claTable: new Array(),
      claProjectNames: new Array(),
      projectList: null,
      project_direct: false,
      project_id: null,
    };
  }

  async componentDidMount() {
    await this.getApprovals();
    await this.getCLAs();
    await this.getContributions();
    await this.getUsers();
    await this.getProjects();
    await this.props.fetchGroups();

    const queryParams = QS.parse(this.props.location.search, {
      parseNumbers: true,
    });
    // read query params and take actions as needed
    if (queryParams.strategic_group) {
      // turns out order is important...
      await this.props.updateAdminGroup(queryParams.strategic_group);
      await this.changeNav('editGroup');
      await this.props.fetchGroup(queryParams.strategic_group);
    } else if (queryParams.strategic_project) {
      this.setState({
        project_direct: true,
        project_id: queryParams.strategic_project as number,
      });
      await this.changeNav('editProject');
    }
  }

  getApprovals = async () => {
    const approvalList = await reqJSON('/api/contributions/approvals');
    this.setState({
      approvalList,
    });
  };

  getCLAs = async () => {
    const claList = await reqJSON('/api/cla');
    this.setState({
      claTable: claList.claTable,
    });
  };

  getContributions = async () => {
    const contributionList = await reqJSON('/api/contributions/bulk');
    this.setState({
      contributionList,
    });
  };

  getUsers = async () => {
    const userList = await reqJSON('/api/strategic/groups/users');
    this.setState({
      userList: userList.users,
    });
  };

  getProjects = async () => {
    const projectList = await reqJSON('/api/strategic/projects');
    this.setState({
      projectList: projectList.projectList,
    });
  };

  changeNav = nav => {
    this.props.updateAdminNav(nav);
  };

  setApprovalList = () => {
    this.changeNav('approveContrib');
  };

  setContributionList = async () => {
    this.changeNav('editContrib');
  };
  setCLAList = () => {
    this.changeNav('viewCCLA');
  };

  setCLAFormTrue = () => {
    this.changeNav('newCCLA');
  };

  setGroupList = () => {
    this.changeNav('viewGroup');
  };

  setProjectEdit = () => {
    this.changeNav('editProject');
  };

  setGroupForm = () => {
    this.changeNav('newGroup');
  };

  setProjectForm = () => {
    this.changeNav('newProject');
  };

  setUserForm = () => {
    this.changeNav('newUser');
  };

  setEditUser = () => {
    this.changeNav('editUser');
  };

  displaySelected = () => {
    const queryParams = QS.parse(this.props.location.search);
    if (
      !this.props.nav &&
      (queryParams.strategic_group || queryParams.strategic_project)
    ) {
      return (
        <div>
          Loading Data
          <PulseLoader color="#26A65B" size="16px" margin="4px" />
        </div>
      );
    } else {
      // act in accordance to the current nav view and data
      switch (this.props.nav) {
        case 'approveContrib':
          return <ApprovalsTable approvalList={this.state.approvalList} />;
        case 'editContrib':
          return (
            <EditContributionTable
              contributionList={this.state.contributionList}
            />
          );
        case 'viewCCLA':
          return <CLATable cla={this.state.claTable} />;
        case 'newCCLA':
          return <CCLAForm toggleForm={this.toggleCLAForm} />;
        case 'viewGroup':
          return <GroupsTable groups={this.props.groups} type="edit" />;
        case 'editProject':
          return (
            <ViewProject
              projectList={this.state.projectList}
              groupList={this.props.groups}
              direct={this.state.project_direct}
              projectID={this.state.project_id}
            />
          );
        case 'editGroup':
          return <EditGroup />;
        case 'newGroup':
          return <GroupForm />;
        case 'newProject':
          return <ProjectForm />;
        case 'newUser':
          return <UserForm />;
        case 'editUser':
          return <ViewUser userList={this.state.userList} />;
        default:
          return <p>Select an option from the left.</p>;
      }
    }
  };

  // ftn passed to child to update the view once a form is submitted
  toggleCLAForm = async status => {
    await this.getCLAs(); // forces a refresh for the CLA lsit
  };

  render() {
    const view = this.displaySelected();
    return (
      <div className="container-fluid" id="admin_container">
        <div className="row">
          <div className="col-lg-2 mb-3">
            <h4>Contributions</h4>
            <div className="list-group mb-3">
              <a
                href="#"
                onClick={this.setApprovalList}
                className="list-group-item list-group-item-action"
              >
                Approve Contributions
              </a>
              <a
                href="#"
                onClick={this.setContributionList}
                className="list-group-item list-group-item-action"
              >
                Edit Contributions
              </a>
            </div>

            <h4>CCLAs</h4>
            <div className="list-group">
              <a
                href="#"
                onClick={this.setCLAList}
                className="list-group-item list-group-item-action"
              >
                View CCLAs
              </a>
              <a
                href="#"
                onClick={this.setCLAFormTrue}
                className="list-group-item list-group-item-action"
              >
                New CCLA
              </a>
            </div>
            <br />
            <h4>Strategic Groups</h4>
            <div className="list-group">
              <a
                href="#"
                onClick={this.setGroupList}
                className="list-group-item list-group-item-action"
              >
                Edit Groups
              </a>
              <a
                href="#"
                onClick={this.setProjectEdit}
                className="list-group-item list-group-item-action"
              >
                Edit Project
              </a>
              <a
                href="#"
                onClick={this.setEditUser}
                className="list-group-item list-group-item-action"
              >
                Edit Users
              </a>
              <a
                href="#"
                onClick={this.setGroupForm}
                className="list-group-item list-group-item-action"
              >
                Add New Group
              </a>
              <a
                href="#"
                onClick={this.setProjectForm}
                className="list-group-item list-group-item-action"
              >
                Add New Project
              </a>
              <a
                href="#"
                onClick={this.setUserForm}
                className="list-group-item list-group-item-action"
              >
                Add New User
              </a>
            </div>
          </div>

          <ExtensionPoint ext="admin-sidebar" />

          <div className="col-lg-10 mb-3">
            <div className="panel-body" key={this.state.key}>
              {view}

              <ExtensionPoint ext="admin-content" />
            </div>
          </div>
          <div id="alert" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    nav: state.admin.nav,
    group: state.admin.group,
    groups: state.groups.all,
  };
};

export default connect(mapStateToProps, actions)(Admin);
