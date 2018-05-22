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
import { connect } from 'react-redux';

import { reqJSON } from '../util/index';

import CLAEditor from '../components/CLAEditor';

interface Props {
  params: any;
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
  additional_notes: string;
  ticket_link: string;
  cla_project_names: any[];
  cla_project_approvers_names: any[];
  display: {
    signatory: string[];
    poc: string[];
  };
}

class EditCla extends React.Component<Partial<Props>, State> {
  constructor(props) {
    super(props);
    this.state = {
      project_name: null,
      signed_date: new Date().toISOString(),
      approved_date: new Date().toISOString(),
      contributor_names: '',
      approver_name: '',
      signatory_name: '',
      contact_name: '',
      additional_notes: '',
      ticket_link: '',
      cla_project_names: new Array(),
      cla_project_approvers_names: new Array(),
      display: {
        signatory: [],
        poc: [],
      },
    };
  }

  async componentWillMount() {
    const nameList = await reqJSON('/api/cla/projects');
    const approvers = await reqJSON('/api/approvers');
    this.setState({
      cla_project_names: nameList.projectNames,
      cla_project_approvers_names: approvers.approverList,
    });

    const id = (this.props as any).match.params.project_id;
    const cla = await reqJSON(`/api/cla/getproject/${id}`);
    const object = cla.gotCla[0];
    this.setState({
      project_name: object.project_name,
      signed_date: object.date_signed,
      approved_date: object.date_approved,
      contributor_names: object.contributor_name,
      approver_name: object.approver_name,
      signatory_name: object.signatory_name,
      contact_name: object.contact_name,
      ticket_link: object.ticket_link,
      additional_notes: object.additional_notes,
    });
    const config = await reqJSON('/api/config/display');
    this.setState({
      display: config,
    });
  }

  render() {
    return (
      <CLAEditor
        project_id={(this.props as any).match.params.project_id}
        dispatch={this.props.dispatch}
        data={this.state}
      />
    );
  }
}

export default connect(state => ({}))(EditCla);
