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

import * as EmployeeActions from '../actions/employeeAction';
import AllEmployeeTable from '../components/AllEmployeeTable';

interface Props extends React.Props<any> {
  dispatch: any;
  employeeData: any;
}

interface State extends React.Props<any> {
  currentAlias: string;
  search: string;
  aliasList: Array<any>;
}

class Employee extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentAlias: '',
      aliasList: new Array(),
      search: '',
    };
  }

  storeSearch = (e) => {
    let currentsearch = e.currentTarget.value;
    if (this.state.aliasList.indexOf(currentsearch) !== -1) {
      this.setState({
        currentAlias: currentsearch,
      });
    };
  }

  componentWillMount() {
    let {dispatch} = this.props;
    dispatch(EmployeeActions.fetchCurrentUser());
    dispatch(EmployeeActions.fetchDataListAlias());
  }

  componentWillReceiveProps() {
    let { employeeData } = this.props;
    employeeData.aliasNames ? this.filterAliasNames(employeeData.aliasNames) : '';
  }

  filterAliasNames = (alias) => {
    let newArray = Object.keys(alias.contributionList.undefined).map(key => alias.contributionList.undefined[key].alias);
    let aliasSet = new Set(newArray.sort());
    let aliasArray = Array.from(aliasSet);
    this.setState({
      aliasList: aliasArray,
    });
    return aliasArray;
  }

  render() {
    let employeeData = this.props.employeeData;
    let currentAlias = this.state.currentAlias === '' ? employeeData.user : this.state.currentAlias;
    return (
      <div>
        <input type="text" list="browsers" id="projectLISearch" onInput={this.storeSearch} placeholder="Contributor Alias" className="form-control" />
        <datalist id="browsers">
          {this.state.aliasList.map(alias => (<option key={alias} value={alias}/>))}
        </datalist>
        <div id="contributionsListMine" className="mt-3">
          <AllEmployeeTable alias={currentAlias} />
        </div>
      </div>
    );
  }
}
export default connect(state => {
  return {
    employeeData: state.employee,
  };
})(Employee);