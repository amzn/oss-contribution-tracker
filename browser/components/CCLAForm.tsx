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
import * as React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { connect } from 'react-redux';

import * as claLogger from '../modules/claLogger';
import { reqJSON } from '../util/index';

interface Props {
  dispatch: any;
  toggleForm: any;
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
  cla_project_names: any[];
  cla_project_approvers_names: any[];
  alert: any;
  display: {
    signatory: string[];
    poc: string[];
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

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const projName = (e.target.elements
      .projectName as HTMLInputElement).value.trim();
    const contribNames = (e.target.elements
      .contributorName as HTMLInputElement).value.trim();
    const appName = (e.target.elements
      .appName as HTMLInputElement).value.trim();
    const sigName = (e.target.elements
      .sigName as HTMLInputElement).value.trim();
    const contactName = (e.target.elements
      .contactName as HTMLInputElement).value.trim();
    const dateApproved = (e.target.elements
      .dateApproved as HTMLInputElement).value.toLowerCase();
    const dateSigned = (e.target.elements
      .dateSigned as HTMLInputElement).value.toLowerCase();
    const notes = (e.target.elements
      .description as HTMLInputElement).value.toLowerCase();
    const jsonObj = {
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

    const getAlert = () => (
      <SweetAlert
        success={true}
        title="Success"
        onConfirm={() => this.hideAlert()}
      >
        Entry has been added
      </SweetAlert>
    );

    this.setState({
      alert: getAlert(),
    });
  };

  hideAlert = () => {
    this.setState({
      alert: null,
    });
    this.props.toggleForm(false);
  };

  getOptionsProjectNames = () => {
    return this.state.cla_project_names.map(object => (
      <option key={object.project_name} value={object.project_name} />
    ));
  };

  getOptionsApproverNames = () => {
    return this.state.cla_project_approvers_names.map(alist => (
      <option key={alist.approver_alias} value={alist.approver_alias} />
    ));
  };

  async componentWillMount() {
    const projects = await reqJSON('/api/cla/projects');
    const approvers = await reqJSON('/api/approvers');
    const config = await reqJSON('/api/config/display');
    this.setState({
      cla_project_names: projects.projectNames,
      cla_project_approvers_names: approvers.approverList,
      display: config,
    });
  }

  render() {
    return (
      <div>
        <h3>New CCLA</h3>
        <form id="contributions-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Project name</label>
            <br />
            <input
              type="text"
              list="project_name"
              className="form-control"
              name="projectName"
              defaultValue={null}
              required={true}
            />
            <datalist id="project_name">
              {this.getOptionsProjectNames()}
            </datalist>
            <br />
            <label>Contributor[s]</label> <br />
            <input
              type="text"
              className="form-control"
              name="contributorName"
              defaultValue={null}
            />
            <br />
            <label>Approver</label> <br />
            <input
              type="text"
              list="approver_names"
              className="form-control"
              name="appName"
              defaultValue={null}
              required={true}
            />
            <datalist id="approver_names">
              {this.getOptionsApproverNames()}
            </datalist>
            <br />
            <label>Signatory</label> <br />
            <input
              type="text"
              list="signatory_name"
              className="form-control"
              name="sigName"
              defaultValue={null}
              required={true}
            />
            <datalist id="signatory_name">
              {this.state.display.signatory.map(user => {
                return <option key={user} value={user} />;
              })}
            </datalist>
            <br />
            <label>Point of Contact</label> <br />
            <input
              type="text"
              list="contact"
              className="form-control"
              name="contactName"
              defaultValue={null}
              required={true}
            />
            <datalist id="contact">
              {this.state.display.poc.map(user => {
                return <option key={user} value={user} />;
              })}
            </datalist>
            <br />
            <label>Date Signed</label>
            <input
              type="date"
              className="form-control"
              name="dateSigned"
              required={true}
            />
            <br />
            <label>Date Approved</label>
            <input
              type="date"
              className="form-control"
              name="dateApproved"
              required={true}
            />
            <br />
            <label>Additional Notes</label> <br />
            <textarea
              id="description"
              className="form-control"
              rows={3}
              name="description"
              required={true}
            />
          </div>

          <div className="form-group">
            <div className="btn-group">
              <button
                className="btn btn-secondary"
                type="submit"
                onClick={this.hideAlert}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
        {this.state.alert}
      </div>
    );
  }
}

export default connect(state => ({}))(CCLAForm) as any;
