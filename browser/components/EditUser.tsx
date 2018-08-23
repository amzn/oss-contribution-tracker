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
import { postJSON, reqJSON } from '../util/index';

interface Props {
  alias: string;
}

interface State {
  company_alias: string;
  github_alias: string;
  groups: any; // in the format of a number: string
  groupList: any[];
  alert: any;
}

export default class EditUser extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      company_alias: '',
      github_alias: '',
      groups: new Array(),
      groupList: null,
      alert: null,
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        company_alias: this.props.alias,
      });
      await this.getUser();
      await this.getGroupOptions();
    }
  }

  getUser = async () => {
    if (this.props.alias) {
      const user = (await reqJSON(`/api/strategic/users/${this.props.alias}`))
        .user;
      this.setState({
        github_alias: user.github_alias,
        groups: user.groups,
      });
    }
  };

  getGroupOptions = async () => {
    const groups = [];
    for (const key in this.state.groups) {
      if (this.state.groups.hasOwnProperty(key)) {
        const group = (await reqJSON(`/api/strategic/groupdetails/${key}`))
          .group;
        if (group) {
          groups.push(
            <div className="form-group" key={key}>
              <label>{group.group_name} start date</label>
              <input
                type="date"
                className="form-control"
                name={key}
                required={true}
                value={this.state.groups[key]}
                onChange={this.handleDateChange}
              />
            </div>
          );
        }
      }
    }
    this.setState({
      groupList: groups,
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const alias = e.target.elements.github_alias.value;

    const user = {
      company_alias: this.state.company_alias,
      github_alias: alias,
      groups: JSON.stringify(this.state.groups),
    };

    await postJSON(
      `/api/strategic/users/${this.state.company_alias}/update`,
      user
    );
    this.alert();
  };

  handleGithubChange = e => {
    this.setState({ github_alias: e.target.value });
  };

  handleDateChange = async e => {
    this.state.groups[e.target.name] = e.target.value;
    await this.getGroupOptions();
  };

  handleCancel = () => {
    this.setState({
      company_alias: null,
      groupList: null,
    });
  };

  alert = () => {
    this.setState({
      alert: (
        <SweetAlert success={true} title="Success!" onConfirm={this.hideAlert}>
          User {this.state.company_alias} has been updated!
        </SweetAlert>
      ),
    });
  };

  hideAlert = () => {
    this.setState({
      alert: null,
      company_alias: null,
      groupList: null,
    });
  };

  render() {
    if (this.state.company_alias && this.state.groupList) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <form id="user-form" onSubmit={this.handleSubmit}>
                <h3>Edit {this.state.company_alias} details</h3>
                <br />
                <div className="form-group">
                  <label>Github alias</label>
                  <input
                    type="text"
                    className="form-control"
                    name="github_alias"
                    required={true}
                    value={this.state.github_alias}
                    onChange={this.handleGithubChange}
                  />
                </div>
                {this.state.groupList}
                <button
                  className="btn btn-secondary"
                  onClick={this.handleCancel}
                >
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
    } else {
      return <div />;
    }
  }
}
