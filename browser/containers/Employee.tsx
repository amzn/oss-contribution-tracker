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
import { Link } from 'react-router-dom';
import Select from 'react-select';

import * as EmployeeActions from '../actions/employeeAction';
import AllEmployeeTable from '../components/AllEmployeeTable';

interface Props extends React.Props<any> {
  dispatch: any;
  employeeData: any;
}

interface State {
  currentAlias: string;
  aliasList: any[];
}

class Employee extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentAlias: '',
      aliasList: new Array(),
    };
  }

  storeSearch = e => {
    this.setState({
      currentAlias: e.value,
    });
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(EmployeeActions.fetchCurrentUser());
    dispatch(EmployeeActions.fetchDataListAlias());
  }

  componentWillReceiveProps() {
    const { employeeData } = this.props;
    if (employeeData.aliasNames) {
      this.filterAliasNames(employeeData.aliasNames);
    }
  }

  filterAliasNames = alias => {
    const newArray = Object.keys(alias.contributionList.undefined).map(
      key => alias.contributionList.undefined[key].alias
    );
    const aliasSet = new Set(newArray.sort());
    const aliasArray = Array.from(aliasSet);
    this.setState({
      aliasList: aliasArray,
    });
  };

  render() {
    const employeeData = this.props.employeeData;
    const currentAlias =
      this.state.currentAlias === ''
        ? employeeData.user
        : this.state.currentAlias;
    return (
      <>
        <p>
          <Link className="btn btn-info" to="/contribute/link">
            View Unfinished Contributions
          </Link>
        </p>
        <Select
          id="projectLISearch"
          placeholder="Select Contributor"
          options={this.state.aliasList.map(a => ({ label: a, value: a }))}
          onChange={this.storeSearch}
          required={true}
          menuContainerStyle={{ zIndex: 4 }}
          openOnFocus={true}
        />
        <div id="contributionsListMine" className="mt-3">
          <AllEmployeeTable alias={currentAlias} />
        </div>
      </>
    );
  }
}
export default connect(state => ({
  employeeData: state.employee,
}))(Employee);
