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
    reqJSON('/api/contributions/approvals').then(temp => {
      this.setState({
        approvalList: temp,
      });
    });
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

  setCLAForm = () => {
    this.setState({
      claFormBoolean: true,
      claTableBoolean: false,
      approvalListBoolean: false,
      editContributionListBoolean: false,
    });
  }
  renderTable = (contribution) => {
    if (this.state.approvalListBoolean) {
      return(<ApprovalsTable approvalList={this.state.approvalList} />);
    };
    if (this.state.editContributionListBoolean) {
      if (this.state.key <= 2) {
        let temp = this.state.key;
        this.setState({
          key: temp ++,
        });
      }
      return(<EditContributionTable contributionList={contribution}/>);
    }
    else {
      if (!this.state.claTableBoolean && !this.state.claFormBoolean) {
        return(<h3>Select an option from the panel to show results</h3>);
      }
    }
  }

  render() {
    let claTable = this.state.claTable;
    let contributionList = this.state.contributionList;
    return (
      <div className="container-fluid" id="admin_container">
      <div className="row">
        <div className="col-sm-2">
          <div className="nav-side-menu">
            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
              <div className="panel panel-default">
                <div className="panel-heading" role="tab" id="contributions-heading">
                  <h4 className="panel-title">
                    <a id="contributions_link_admin" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Contributions
                    </a>
                  </h4>
                </div>
                <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                  <div className="list-group">
                    <li onClick={this.setApprovalList} id="approve_contributions_admin_link">Approve Contributions <span className="glyphicon glyphicon-ok" /></li>
                    <li onClick={this.setContributionList} id="edit_contributions_admin_link" >Edit Collaborations <span className="glyphicon glyphicon-pencil" /></li>
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading" role="tab" id="ccla-heading">
                  <h4 className="panel-title">
                    <a id="ccla_link_admin" className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                      CCLAs
                    </a>
                  </h4>
                </div>
                <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                  <div className="list-group">
                    <li id="view_cla_link" onClick={this.setCLAList}>View CCLAs <span className="glyphicon glyphicon-list-alt" /></li>
                    <li id="new_cla_link" onClick={this.setCLAForm}>New CCLA <span className="glyphicon glyphicon-edit" /></li>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-9 col-sm-offset-2">
          <div className="panel-body" key ={this.state.key}>
            {this.state.editContributionListBoolean ? (<EditContributionTable contributionList={this.state.contributionList}/>) : this.renderTable(contributionList)}
            {this.state.claTableBoolean && <CLATable cla={claTable}/>}
            {this.state.claFormBoolean && <CCLAForm />}
          </div>
        </div>
      </div>
      <div id="alert" ></div>
      </div>
    );
  }
}