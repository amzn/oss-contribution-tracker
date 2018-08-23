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
import { Component } from 'react';
import { connect } from 'react-redux';
import { reqJSON } from '../util/index';

import ApprovalsTable from '../components/ApprovalsTable';
import CCLAForm from '../components/CCLAForm';
import CLATable from '../components/CLATable';
import EditContributionTable from '../components/EditContributionTable';
import EditGroup from '../components/EditGroup';
import GroupsTable from '../components/GroupsTable';
import ProjectForm from '../components/ProjectForm';
import GroupForm from '../components/StrategicGroupForm';
import UserForm from '../components/UserForm';
import ViewUser from '../components/ViewUser';

import * as actions from '../actions/strategicActions';

import ExtensionPoint from '../util/ExtensionPoint';

interface Props {
  alert: any;
  nav: string;
  group: number;
  updateAdminNav: any;
  groups: any;
  fetchGroups: any;
}

interface State {
  approvalList: any;
  contributionList: any;
  userList: any[];
  user: any;
  key: number;
  claTable: any;
  claProjectNames: any[];
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
    };
  }

  async componentDidMount() {
    await this.getApprovals();
    await this.getCLAs();
    await this.getContributions();
    await this.getUsers();
    await this.props.fetchGroups();
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
    const userList = await reqJSON('/api/strategic/users');
    this.setState({
      userList: userList.users,
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

const mapStateToProps = state => ({
  nav: state.admin.nav,
  group: state.admin.group,
  groups: state.groups.all,
});

export default connect(mapStateToProps, actions)(Admin);
