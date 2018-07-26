/* Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
import Select from 'react-select';

import * as actions from '../actions/strategicActions';

interface Props {
  addNewUser: (user) => any;
  fetchGroups: () => void;
  groups: Array<{
    group_id: number;
    group_name: string;
    goal: string;
    sponsor: string;
    numUsers: number;
    numProjects: number;
  }>;
  updateAdminNav: (navpage) => void;
}

interface State {
  company: string;
  github: string;
  groups: number[];
  alert: JSX.Element;
}

class UserForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      company: '',
      github: '',
      groups: [],
      alert: null,
    };
  }

  componentDidMount() {
    this.props.fetchGroups();
  }

  handleSubmit = async e => {
    e.preventDefault();
    const fields = e.target.elements;
    const groups = [];
    if (fields.groups) {
      if (fields.groups.length > 1) {
        for (const group of fields.groups) {
          groups.push(parseInt(group.value, 10));
        }
      } else {
        groups.push(parseInt(fields.groups.value, 10));
      }
    }

    const jsonObj = {
      company_alias: fields.company.value,
      github_alias: fields.github.value,
      groups,
    };

    const response = await this.props.addNewUser(jsonObj);
    this.alert(response.result);
  };

  groupList = () => {
    const groups = this.props.groups || [];
    return groups.map(listValue => {
      return { label: listValue.group_name, value: listValue.group_id };
    });
  };

  handleGroupChange = value => {
    this.setState({ groups: value });
  };

  alert = result => {
    if (result === 'exists') {
      this.setState({
        alert: (
          <SweetAlert
            warning={true}
            title="Already exists"
            onConfirm={this.hideAlert}
          >
            This user already exists
          </SweetAlert>
        ),
      });
    } else {
      this.setState({
        alert: (
          <SweetAlert
            success={true}
            title="Success!"
            onConfirm={this.hideAlert}
          >
            New user has been added
          </SweetAlert>
        ),
      });
    }
  };

  hideAlert = () => {
    this.setState({ alert: null });
    this.props.updateAdminNav(null);
  };

  handleCancel = () => {
    this.props.updateAdminNav('viewGroup');
  };

  render() {
    const groupOptions = this.groupList();
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <form id="contributions-form" onSubmit={this.handleSubmit}>
              <h3>New User</h3>
              <br />
              <div className="form-group">
                <label>Company alias</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  required={true}
                />
              </div>
              <div className="form-group">
                <label>Github alias</label>
                <input
                  type="text"
                  className="form-control"
                  name="github"
                  required={true}
                />
              </div>

              <div className="form-group">
                <label>Groups</label>
                <Select
                  name="groups"
                  placeholder="Select Groups"
                  options={groupOptions}
                  onChange={this.handleGroupChange}
                  openOnFocus={true}
                  multi={true}
                  simpleValue={true}
                  value={this.state.groups}
                />
              </div>

              <button className="btn btn-secondary" onClick={this.handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
        {this.state.alert}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.groups.all,
});

export default connect(mapStateToProps, actions)(UserForm);
