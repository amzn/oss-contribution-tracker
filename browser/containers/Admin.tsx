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

interface Props {
  alert: any;
}

interface State {
  approvalList: any;
  approvalListBoolean: any;
  contributionList: any;
  editContributionListBoolean: any;
  user: any;
  key: number;
  claTable: any;
  claTableBoolean: any;
  claFormBoolean: any;
  claProjectNames: Array<any>;
}

export default class Admin extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      approvalList: new Array(),
      approvalListBoolean: false,
      contributionList: new Array(),
      editContributionListBoolean: false,
      user: '',
      key: 0,
      claTable: new Array(),
      claTableBoolean: false,
      claFormBoolean: false,
      claProjectNames: new Array(),
    };
  }

  componentWillMount() {
    this.getApprovals();
    this.getCLAs();
  }

  getApprovals = () => {
    reqJSON('/api/contributions/approvals').then(temp => {
      this.setState({
        approvalList: temp,
      });
    });
  }

  getCLAs = () => {
    reqJSON('/api/cla').then(claList => {
      this.setState({
        claTable: claList.claTable,
      });
    });
  }

  setApprovalList = () => {
    this.setState({
      approvalListBoolean: true,
      editContributionListBoolean: false,
      claTableBoolean: false,
      claFormBoolean: false,
    });
  }

  setContributionList = () => {
    reqJSON('/api/contributions/bulk').then(temp => {
      this.setState({
        contributionList: temp,
        editContributionListBoolean: true,
        approvalListBoolean: false,
        claTableBoolean: false,
        claFormBoolean: false,
      });
    });
  }
  setCLAList = () => {
    this.setState({
      claTableBoolean: true,
      approvalListBoolean: false,
      editContributionListBoolean: false,
      claFormBoolean: false,
    });
  }

  setCLAFormTrue = () => {
    this.setState({
      claFormBoolean: true,
      claTableBoolean: false,
      approvalListBoolean: false,
      editContributionListBoolean: false,
    });
  }

  setCLAFormFalse = () => {
    this.setState({
      claFormBoolean: false,
      claTableBoolean: false,
      approvalListBoolean: false,
      editContributionListBoolean: false,
    });
  }

  // ftn passed to child to update the view once a form is submitted
  toggleCLAForm = (status) => {
    if (status) {
      this.setCLAFormTrue();
    } else {
      this.setCLAFormFalse();
    };
    this.getCLAs(); // forces a refresh for the CLA lsit
  }

  render() {
    let claTable = this.state.claTable;
    return (
      <div className="container-fluid" id="admin_container">
        <div className="row">
          <div className="col-lg-2 mb-3">
            <h4>Contributions</h4>
            <div className="list-group mb-3">
              <a href="#" onClick={this.setApprovalList} className="list-group-item list-group-item-action">Approve Contributions</a>
              <a href="#" onClick={this.setContributionList} className="list-group-item list-group-item-action">Edit Contributions</a>
            </div>

            <h4>CCLAs</h4>
            <div className="list-group">
              <a href="#" onClick={this.setCLAList} className="list-group-item list-group-item-action">View CCLAs</a>
              <a href="#" onClick={this.setCLAFormTrue} className="list-group-item list-group-item-action">New CCLA</a>
            </div>
          </div>

          <div className="col-lg-10 mb-3">
            <div className="panel-body" key={this.state.key}>
              {!this.state.approvalListBoolean && !this.state.editContributionListBoolean && !this.state.claTableBoolean && !this.state.claFormBoolean && <p>Select an option from the left.</p>}
              {this.state.approvalListBoolean && <ApprovalsTable approvalList={this.state.approvalList} />}
              {this.state.editContributionListBoolean && <EditContributionTable contributionList={this.state.contributionList}/>}
              {this.state.claTableBoolean && <CLATable cla={claTable} />}
              {this.state.claFormBoolean && <CCLAForm toggleForm={this.toggleCLAForm}/>}
            </div>
          </div>
          <div id="alert" ></div>
        </div>
      </div>
    );
  }
}