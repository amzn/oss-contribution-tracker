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
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

import * as claLogger from'../modules/claLogger';

interface Props {
  project_id: any;
  dispatch: any;
  data: any;
}

interface State {
  alert: any;
  data: {
    additional_notes: string;
    approved_date: string;
    approver_name: string;
    cla_project_approvers_names: Array<object>;
    cla_project_names: Array<object>;
    contact_name: string;
    contributor_names: string;
    display: {
      signatory: Array<string>,
      poc: Array<string>,
    };
    project_name: string;
    signatory_name: string;
    signed_date: string;
  };
  project_id: string;
}

export default class CLAEditor extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      data: null,
      project_id: this.props.project_id,
    };
  }

  componentWillMount() {
    this.setState({
      data: this.props.data as State['data'],
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data as State['data'],
    });
  }

  handleDelete = (e) => {
    e.preventDefault();
    let getAlertDelete = () => (
    <SweetAlert
      warning
      showCancel
      confirmBtnText="Yes, delete it!"
      confirmBtnBsStyle="danger"
      cancelBtnBsStyle="default"
      title="Are you sure? There's no coming back."
      onConfirm={() => this.deleteFile()}
      onCancel={() => this.hideAlert()}
    >
      This entry will be deleted!
    </SweetAlert>
    );
    this.setState({
      alert: getAlertDelete(),
    });
  }

  deleteFile = () => {
    let { dispatch } = this.props;
    let jsonObj = { project_id: this.state.project_id };
    dispatch(claLogger.deleteClaEntry(jsonObj));
    let getAlertConfirmDelete = () => (
      <SweetAlert
        success
        title="Success"
        onConfirm={() => this.hideAlert()}
      >
        Entry has been deleted
      </SweetAlert>
    );
    this.setState({
      alert: getAlertConfirmDelete(),
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let { dispatch } = this.props;
    let projectNames = (e.target.elements.projectName as HTMLInputElement).value.trim();
    let contributorName = (e.target.elements.contributorName as HTMLInputElement).value.trim();
    let appName = (e.target.elements.appName as HTMLInputElement).value.trim();
    let sigName = (e.target.elements.sigName as HTMLInputElement).value.trim();
    let contactName = (e.target.elements.contactName as HTMLInputElement).value.trim();
    let desc = (e.target.elements.description as HTMLInputElement).value.toLowerCase();
    let dateApproved = (e.target.elements.dateApproved as HTMLInputElement).value.toLowerCase();
    let dateSigned = (e.target.elements.dateSigned as HTMLInputElement).value.toLowerCase();
    let jsonObj = {
      project_id: this.state.project_id,
      project_name: projectNames === '' ? this.state.data.project_name : projectNames,
      contributor_names: contributorName === '' ? this.state.data.contributor_names : contributorName,
      approver_name: appName  === '' ? this.state.data.approver_name : appName,
      signatory_name: sigName  === '' ? this.state.data.signatory_name : sigName,
      contact_name: contactName === '' ? this.state.data.contact_name : contactName,
      additional_notes: desc === '' ? this.state.data.additional_notes : desc,
      date_approved: dateApproved,
      date_signed: dateSigned,
    };

    dispatch(claLogger.updateCla(jsonObj));

    let getAlert = () => (
      <SweetAlert
        success
        title="Success"
        onConfirm={() => this.hideAlert()}
      >
          Entry has been updated
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }

  hideAlert = () => {
    this.setState({
      alert: null,
    }),
    document.getElementById('to-admin').click();
  }

  handleDateChangeForApproval = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        approved_date: e,
      },
    });
  }

  getOptionsProjectNames = () => {
    return(this.state.data.cla_project_names.map(
      (object: any) => {
        return (<option key={object.project_name} value={object.project_name}></option>)
      },
    ));
  }

  getOptionsApproverNames= () => {
    return(this.state.data.cla_project_approvers_names.map(
      (alist: any) => {
        return (<option key={alist.approver_alias} value={alist.approver_alias}></option>)
      },
    ));
  }

  handleDateChangeForSigned = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        signed_date: e,
      },
    });
  }

  render() {
    let projectName = this.state.data.project_name ? this.state.data.project_name : '';
    if (projectName != null) {
      return (
        <form id="contributions-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Project name</label>
            <br/>
            <input type="text" list="project_name" id="projectName" className="form-control" name="projectName" placeholder={this.state.data.project_name}/>
            <datalist id="project_name">
              {this.getOptionsProjectNames()}
            </datalist>
            <br/>
            <label>Contributor(s)</label>
            <br/>
            <input type="text" className="form-control" id="contributorName" name="contributorName" placeholder={this.state.data.contributor_names}/><br/>
            <label>Approver</label>
            <br/>
            <input type="text" list="approver_names" className="form-control" name="appName" id="appName" placeholder={this.state.data.approver_name}/>
            <datalist id="approver_names">
              {this.getOptionsApproverNames()}
            </datalist>
            <br/>
            <label>Signatory</label>
            <br/>
            <input type="text"  list="signatory_name" className="form-control" name="sigName" id="sigName" placeholder={this.state.data.signatory_name}/>
            <datalist id="signatory_name">
              {this.state.data.display.signatory.map(user => {
                return (<option key={user} value={user}/>);
              })}
            </datalist>
            <br/>
            <label>Point of Contact</label>
            <br/>
            <input type="text"  list="contact" className="form-control" id="contactName" name="contactName" placeholder={this.state.data.contact_name}/>
            <datalist id="contact">
              {this.state.data.display.poc.map(user => {
                return (<option key={user} value={user}/>);
              })}
            </datalist>
            <br/>
            <label>Date Signed</label>
            <input type="date" className="form-control" name="dateSigned" id="dateSigned" onChange={this.handleDateChangeForSigned} required/>
            <br/>
            <label>Date Approved</label>
            <input type="date" className="form-control" name="dateApproved" id="dateApproved" onChange={this.handleDateChangeForApproval} required/>
            <br/>
            <label>Additional Notes</label>
            <br/>
            <textarea id="description" className="form-control" rows={3} placeholder={this.state.data.additional_notes} name="description" required></textarea>
          </div>
          <div className="col-md-10">
            <div className="pullRight">
              <Link className="btn btn-secondary" id="to-admin" to="/admin">Cancel</Link>
              <button className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
              <button className="btn btn-primary" type="submit">Make Changes</button>
            </div>
          </div>
          {this.state.alert}
        </form>
      );
    } else {
      return <div/>;
    }
  }
}