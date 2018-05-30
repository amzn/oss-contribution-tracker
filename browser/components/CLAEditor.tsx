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
import { Link } from 'react-router-dom';

import * as claLogger from '../modules/claLogger';

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
    cla_project_approvers_names: object[];
    cla_project_names: object[];
    contact_name: string;
    contributor_names: string;
    display: {
      signatory: string[];
      poc: string[];
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
      data: {
        ...(nextProps.data as State['data']),
        signed_date: this.handleDate(this.props.data.signed_date),
        approved_date: this.handleDate(this.props.data.approved_date),
      },
    });
  }

  handleDate(d) {
    if (typeof d === 'string') {
      return d.slice(0, 10);
    }
    return d;
  }

  handleDelete = e => {
    e.preventDefault();
    const getAlertDelete = () => (
      <SweetAlert
        warning={true}
        showCancel={true}
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
  };

  deleteFile = () => {
    const { dispatch } = this.props;
    const jsonObj = { project_id: this.state.project_id };
    dispatch(claLogger.deleteClaEntry(jsonObj));
    const getAlertConfirmDelete = () => (
      <SweetAlert
        success={true}
        title="Success"
        onConfirm={() => this.hideAlert()}
      >
        Entry has been deleted
      </SweetAlert>
    );
    this.setState({
      alert: getAlertConfirmDelete(),
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const projectNames = (e.target.elements
      .projectName as HTMLInputElement).value.trim();
    const contributorName = (e.target.elements
      .contributorName as HTMLInputElement).value.trim();
    const appName = (e.target.elements
      .appName as HTMLInputElement).value.trim();
    const sigName = (e.target.elements
      .sigName as HTMLInputElement).value.trim();
    const contactName = (e.target.elements
      .contactName as HTMLInputElement).value.trim();
    const desc = (e.target.elements
      .description as HTMLInputElement).value.toLowerCase();
    const dateApproved = (e.target.elements
      .dateApproved as HTMLInputElement).value.toLowerCase();
    const dateSigned = (e.target.elements
      .dateSigned as HTMLInputElement).value.toLowerCase();
    const jsonObj = {
      project_id: this.state.project_id,
      project_name:
        projectNames === '' ? this.state.data.project_name : projectNames,
      contributor_names:
        contributorName === ''
          ? this.state.data.contributor_names
          : contributorName,
      approver_name: appName === '' ? this.state.data.approver_name : appName,
      signatory_name: sigName === '' ? this.state.data.signatory_name : sigName,
      contact_name:
        contactName === '' ? this.state.data.contact_name : contactName,
      additional_notes: desc === '' ? this.state.data.additional_notes : desc,
      date_approved: dateApproved,
      date_signed: dateSigned,
    };

    dispatch(claLogger.updateCla(jsonObj));

    const getAlert = () => (
      <SweetAlert
        success={true}
        title="Success"
        onConfirm={() => this.hideAlert()}
      >
        Entry has been updated
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  };

  hideAlert = () => {
    this.setState({
      alert: null,
    }),
      document.getElementById('to-admin').click();
  };

  handleDateChangeForApproval = e => {
    this.setState({
      data: {
        ...this.state.data,
        approved_date: e.target.value,
      },
    });
  };

  getOptionsProjectNames = () => {
    return this.state.data.cla_project_names.map((object: any) => {
      return <option key={object.project_name} value={object.project_name} />;
    });
  };

  getOptionsApproverNames = () => {
    return this.state.data.cla_project_approvers_names.map((alist: any) => {
      return <option key={alist.approver_alias} value={alist.approver_alias} />;
    });
  };

  handleDateChangeForSigned = e => {
    this.setState({
      data: {
        ...this.state.data,
        signed_date: e.target.value,
      },
    });
  };

  handleProjectName = e => {
    this.setState({
      data: {
        ...this.state.data,
        project_name: e.target.value,
      },
    });
  };

  handleContributors = e => {
    this.setState({
      data: {
        ...this.state.data,
        contributor_names: e.target.value,
      },
    });
  };

  handleApprover = e => {
    this.setState({
      data: {
        ...this.state.data,
        approver_name: e.target.value,
      },
    });
  };

  handleSignatory = e => {
    this.setState({
      data: {
        ...this.state.data,
        signatory_name: e.target.value,
      },
    });
  };

  handlePoc = e => {
    this.setState({
      data: {
        ...this.state.data,
        contact_name: e.target.value,
      },
    });
  };

  handleNotes = e => {
    this.setState({
      data: {
        ...this.state.data,
        additional_notes: e.target.value,
      },
    });
  };

  render() {
    const projectName = this.state.data.project_name
      ? this.state.data.project_name
      : '';
    if (projectName != null) {
      return (
        <form id="contributions-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Project name</label>
            <br />
            <input
              type="text"
              list="project_name"
              id="projectName"
              className="form-control"
              name="projectName"
              value={this.state.data.project_name}
              onChange={this.handleProjectName}
            />
            <datalist id="project_name">
              {this.getOptionsProjectNames()}
            </datalist>
            <br />
            <label>Contributor(s)</label>
            <br />
            <input
              type="text"
              className="form-control"
              id="contributorName"
              name="contributorName"
              value={this.state.data.contributor_names}
              onChange={this.handleContributors}
            />
            <br />
            <label>Approver</label>
            <br />
            <input
              type="text"
              list="approver_names"
              className="form-control"
              name="appName"
              id="appName"
              value={this.state.data.approver_name}
              onChange={this.handleApprover}
            />
            <datalist id="approver_names">
              {this.getOptionsApproverNames()}
            </datalist>
            <br />
            <label>Signatory</label>
            <br />
            <input
              type="text"
              list="signatory_name"
              className="form-control"
              name="sigName"
              id="sigName"
              value={this.state.data.signatory_name}
              onChange={this.handleSignatory}
            />
            <datalist id="signatory_name">
              {this.state.data.display.signatory.map(user => {
                return <option key={user} value={user} />;
              })}
            </datalist>
            <br />
            <label>Point of Contact</label>
            <br />
            <input
              type="text"
              list="contact"
              className="form-control"
              id="contactName"
              name="contactName"
              value={this.state.data.contact_name}
              onChange={this.handlePoc}
            />
            <datalist id="contact">
              {this.state.data.display.poc.map(user => {
                return <option key={user} value={user} />;
              })}
            </datalist>
            <br />
            <label>Date Signed</label>
            <input
              type="date"
              className="form-control"
              name="dateSigned"
              id="dateSigned"
              value={this.state.data.signed_date}
              onChange={this.handleDateChangeForSigned}
              required={true}
            />
            <br />
            <label>Date Approved</label>
            <input
              type="date"
              className="form-control"
              name="dateApproved"
              id="dateApproved"
              value={this.state.data.approved_date}
              onChange={this.handleDateChangeForApproval}
              required={true}
            />
            <br />
            <label>Additional Notes</label>
            <br />
            <textarea
              id="description"
              className="form-control"
              rows={3}
              value={this.state.data.additional_notes}
              onChange={this.handleNotes}
              name="description"
              required={true}
            />
          </div>
          <div className="col-md-10">
            <div className="pullRight">
              <Link className="btn btn-secondary" id="to-admin" to="/admin">
                Cancel
              </Link>
              <button className="btn btn-danger" onClick={this.handleDelete}>
                Delete
              </button>
              <button className="btn btn-primary" type="submit">
                Make Changes
              </button>
            </div>
          </div>
          {this.state.alert}
        </form>
      );
    } else {
      return <div />;
    }
  }
}
