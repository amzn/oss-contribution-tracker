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
import { reqJSON } from '../util/index';

import ApprovalsTable from '../components/ApprovalsTable';
import CCLAForm from '../components/CCLAForm';
import CLATable from '../components/CLATable';
import EditContributionTable from '../components/EditContributionTable';

import ExtensionPoint from '../util/ExtensionPoint';

interface Props {
  alert: any;
}

interface State {
  approvalList: any;
  showApprovalList: boolean;
  contributionList: any;
  showContributionEditor: boolean;
  user: any;
  key: number;
  claTable: any;
  showClaTable: boolean;
  showClaForm: boolean;
  claProjectNames: any[];
}

export default class Admin extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      approvalList: new Array(),
      showApprovalList: false,
      contributionList: new Array(),
      showContributionEditor: false,
      user: '',
      key: 0,
      claTable: new Array(),
      showClaTable: false,
      showClaForm: false,
      claProjectNames: new Array(),
    };
  }

  async componentWillMount() {
    await this.getApprovals();
    await this.getCLAs();
  }

  getApprovals = async () => {
    const approvalList = await reqJSON('/api/contributions/approvals');
    this.setState({
      approvalList,
    });
  }

  getCLAs = async () => {
    const claList = await reqJSON('/api/cla');
    this.setState({
      claTable: claList.claTable,
    });
  }

  setApprovalList = () => {
    this.setState({
      showApprovalList: true,
      showContributionEditor: false,
      showClaTable: false,
      showClaForm: false,
    });
  }

  setContributionList = async () => {
    const contributionList = await reqJSON('/api/contributions/bulk');
    this.setState({
      contributionList,
      showContributionEditor: true,
      showApprovalList: false,
      showClaTable: false,
      showClaForm: false,
    });
  }
  setCLAList = () => {
    this.setState({
      showClaTable: true,
      showApprovalList: false,
      showContributionEditor: false,
      showClaForm: false,
    });
  }

  setCLAFormTrue = () => {
    this.setState({
      showClaForm: true,
      showClaTable: false,
      showApprovalList: false,
      showContributionEditor: false,
    });
  }

  setCLAFormFalse = () => {
    this.setState({
      showClaForm: false,
      showClaTable: false,
      showApprovalList: false,
      showContributionEditor: false,
    });
  }

  // ftn passed to child to update the view once a form is submitted
  toggleCLAForm = async (status) => {
    if (status) {
      this.setCLAFormTrue();
    } else {
      this.setCLAFormFalse();
    }
    await this.getCLAs(); // forces a refresh for the CLA lsit
  }

  render() {
    const { claTable, showApprovalList, showClaForm, showClaTable, showContributionEditor } = this.state;

    // whether an item is selected
    const somethingSelected: boolean = [
      showApprovalList, showClaForm, showClaTable, showContributionEditor,
    ].reduce((acc, next) => acc || next);

    return (
      <div className="container-fluid" id="admin_container">
        <div className="row">
          <div className="col-lg-2 mb-3">
            <h4>Contributions</h4>
            <div className="list-group mb-3">
              <a href="#" onClick={this.setApprovalList}
                className="list-group-item list-group-item-action">Approve Contributions</a>
              <a href="#" onClick={this.setContributionList}
                className="list-group-item list-group-item-action">Edit Contributions</a>
            </div>

            <h4>CCLAs</h4>
            <div className="list-group">
              <a href="#" onClick={this.setCLAList} className="list-group-item list-group-item-action">View CCLAs</a>
              <a href="#" onClick={this.setCLAFormTrue} className="list-group-item list-group-item-action">New CCLA</a>
            </div>
          </div>

          <ExtensionPoint ext="admin-sidebar" />

          <div className="col-lg-10 mb-3">
            <div className="panel-body" key={this.state.key}>
              {!somethingSelected &&
                <p>Select an option from the left.</p>}

              {showApprovalList &&
                <ApprovalsTable approvalList={this.state.approvalList} />}
              {showContributionEditor &&
                <EditContributionTable contributionList={this.state.contributionList}/>}
              {showClaTable &&
                <CLATable cla={claTable} />}
              {showClaForm &&
                <CCLAForm toggleForm={this.toggleCLAForm}/>}

              <ExtensionPoint ext="admin-content" />
            </div>
          </div>
          <div id="alert" />
        </div>
      </div>
    );
  }
}
