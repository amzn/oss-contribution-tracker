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
import Select from 'react-select';

import EditUser from './EditUser';

interface Props {
  userList: any[];
}

interface State {
  currentUser: string;
}

export default class ViewUser extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: '',
    };
  }

  setUser = e => {
    this.setState({ currentUser: e.value || '' });
  };

  userList = () => {
    if (this.props.userList.length) {
      const users = this.props.userList;
      return users.map(listValue => {
        return {
          label: listValue.company_alias,
          value: listValue.company_alias,
        };
      });
    }
  };

  render() {
    const userOptions = this.userList();
    return (
      <div>
        <br />
        <Select
          id="user"
          placeholder="Select a user"
          options={userOptions}
          onChange={this.setUser}
          required={true}
          menuContainerStyle={{ zIndex: 4 }}
          openOnFocus={true}
          value={this.state.currentUser}
        />
        <br />
        <EditUser alias={this.state.currentUser} />
      </div>
    );
  }
}
