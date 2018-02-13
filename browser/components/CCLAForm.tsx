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

import * as claLogger from'../modules/claLogger';
import { reqJSON } from '../util/index';

interface Props {
  dispatch: any;
}

interface State {
  project_name: string;
  signed_date: string;
  approved_date: string;
  contributor_names: string;
  approver_name: string;
  signatory_name: string;
  contact_name: string;
  addition_notes: string;
  cla_project_names: Array<any>;
  cla_project_approvers_names: Array<any>;
  alert: any;
  display: {
    signatory: Array<string>,
    poc: Array<string>,
  };
}

class CCLAForm extends React.Component<Partial<Props>, State> {
  constructor(props) {
    super(props);
    this.state = {
      project_name: '',
      signed_date: '',
      approved_date: '',
      contributor_names: '',
      approver_name: '',
      signatory_name: '',
      contact_name: '',
      addition_notes: '',
      cla_project_names: new Array(),
      cla_project_approvers_names: new Array(),
      alert: null,
      display: {
        signatory: [],
        poc: [],
      },
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let { dispatch } = this.props;
    let projName = (e.target.elements.projectName as HTMLInputElement).value.trim();
    let contribNames = (e.target.elements.contributorName as HTMLInputElement).value.trim();
    let appName = (e.target.elements.appName as HTMLInputElement).value.trim();
    let sigName = (e.target.elements.sigName as HTMLInputElement).value.trim();
    let contactName = (e.target.elements.contactName as HTMLInputElement).value.trim();
    let dateApproved = (e.target.elements.dateApproved as HTMLInputElement).value.toLowerCase();
    let dateSigned = (e.target.elements.dateSigned as HTMLInputElement).value.toLowerCase();
    let notes = (e.target.elements.description as HTMLInputElement).value.toLowerCase();
    let jsonObj = {
      project_name: projName,
      contributor_names: contribNames,
      approver_name: appName,
      signatory_name: sigName,
      contact_name: contactName,
      date_approved: dateApproved,
      date_signed: dateSigned,
      additional_notes: notes,
    };

    dispatch(claLogger.postNewCla(jsonObj));

    let getAlert = () => (
      <SweetAlert
        success
        title="Success"
        onConfirm={() => this.hideAlert()}
      >
          Entry has been added
      </SweetAlert>
    );

    this.setState({
      alert: getAlert(),
    });
  }

  hideAlert = () => {
    this.setState({
      alert: null,
    });
    document.getElementById('to-home').click();
  }

  getOptionsProjectNames = () => {
    return(this.state.cla_project_names.map(
      object => (<option key={object.project_name} value={object.project_name}></option>),
    ));
  }

  getOptionsApproverNames = () => {
    return(this.state.cla_project_approvers_names.map(
      alist => (<option key={alist.approver_alias} value={alist.approver_alias}></option>),
    ));
  }

  componentWillMount() {
    reqJSON('/api/cla/projects').then(nameList => {
      this.setState({
        cla_project_names: nameList.projectNames,
      });
    });
     reqJSON('/api/approvers').then(temp => {
      this.setState({
          cla_project_approvers_names: temp.approverList,
      });
    });
    reqJSON('/api/config/display').then(config => {
      this.setState({
        display: config,
      });
    });
  }

  render() {
    return (
      <div>
        <h3>New CCLA</h3>
        <form id="contributions-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Project name</label><br/>
            <input type="text" list="project_name" className="form-control" name="projectName" defaultValue={null} required/>
              <datalist id="project_name">
                {this.getOptionsProjectNames()}
              </datalist><br/>
            <label>Contributor[s]</label> <br/>
            <input type="text" className="form-control" name="contributorName" defaultValue={null}/><br/>
            <label>Approver</label> <br/>
            <input type="text" list="approver_names" className="form-control" name="appName" defaultValue={null} required/>
              <datalist id="approver_names">
                {this.getOptionsApproverNames()}
              </datalist><br/>
            <label>Signatory</label> <br/>
            <input type="text"  list="signatory_name" className="form-control" name="sigName" defaultValue={null} required/>
            <datalist id="signatory_name">
              {this.state.display.signatory.map(user => {
                return (<option key={user} value={user}/>);
              })}
             </datalist><br/>
            <label>Point of Contact</label> <br/>
            <input type="text"  list="contact" className="form-control" name="contactName" defaultValue={null} required/>
            <datalist id="contact">
              {this.state.display.poc.map(user => {
                return (<option key={user} value={user}/>);
              })}
            </datalist><br/>
            <label>Date Signed</label>
            <input type="date" className="form-control" name="dateSigned" required/><br/>
            <label>Date Approved</label>
            <input type="date" className="form-control" name="dateApproved" required/><br/>
            <label>Additional Notes</label> <br/>
            <textarea id="description" className="form-control" rows={3} name="description" required></textarea>
          </div>

          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
        {this.state.alert}
      </div>
    );
  }
}

export default connect(state => {
  return{};
})(CCLAForm);