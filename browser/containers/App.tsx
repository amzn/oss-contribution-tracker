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
import { Link, Route, Switch } from 'react-router-dom';

import ErrorModal from '../components/ErrorModal';
import { setGeneralError } from '../modules/common';

import ExtensionPoint from '../util/ExtensionPoint';
import { reqJSON } from '../util/index';

import Admin from './Admin';
import Approvals from './Approvals';
import Contributions from './Contributions';
import EditCLA from './EditCla';
import EditContribution from './EditContribution';
import Employee from './Employee';
import GithubLinkUpdater from './GithubLinkUpdater';
import Group from './Group';
import List from './List';
import Metrics from './Metrics';
import Project from './Project';
import Report from './Report';
import Strategic from './Strategic';

interface Props {
  children: any;
  dispatch: any;
  generalError: any;
}

interface State {
  user: {
    name: string;
    access: string[];
    groups: string[];
    roles: string[];
  };
  reports: Array<{
    title: string;
    id: number;
  }>;
}

enum AccessTypes {
  admin = 'admin',
  approve = 'approver',
  anon = 'anon',
}

export class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '',
        access: [],
        groups: [],
        roles: [],
      },
      reports: [],
    };
  }

  async componentDidMount() {
    const user = await reqJSON('/api/user');
    const reports = await reqJSON('/api/reports/all');
    this.setState({ user, reports });
  }

  dismissError = () => {
    const { dispatch } = this.props;
    dispatch(setGeneralError(null));
  };

  mapError = err => {
    const dismissError = this.dismissError.bind(this);

    if (err.code === 403) {
      return (
        <ErrorModal
          message={err.message}
          onDismiss={dismissError}
          title="You might not have access to this resource"
          explain="If you think you need access to this item, contact your administrators."
        />
      );
    }
    return (
      <ErrorModal
        message={err.message}
        onDismiss={dismissError}
        title="Something went wrong"
        explain="Please try that again."
      />
    );
  };

  buildSecureRoutes = () => {
    const routes = [];
    if (this.state.user.access.includes(AccessTypes.admin)) {
      routes.push(
        <Route exact={true} path="/admin" component={Admin} key="adminRoute" />
      );
      routes.push(
        <Route path="/cla/:project_id" component={EditCLA} key="editCLARoute" />
      );
      routes.push(
        <Route
          path="/approvals/:contrib_id"
          component={Approvals}
          key="approvalRoute"
        />
      );
      routes.push(
        <Route
          path="/contribution/:contrib_id"
          component={EditContribution}
          key="editContributionRoute"
        />
      );
    }
    return routes;
  };

  buildReportDropdown = () => {
    const dropdown = [];
    for (const report of this.state.reports) {
      dropdown.push(
        <a
          className="dropdown-item"
          key={report.id.toString()}
          href={'/reports/' + report.id.toString()}
        >
          {report.title}
        </a>
      );
    }
    return dropdown;
  };

  render() {
    const { generalError } = this.props;
    const { user } = this.state;

    const securedRoutes = this.buildSecureRoutes();
    const dropdownLinks = this.buildReportDropdown();

    return (
      <>
        <ExtensionPoint ext="page-start" />

        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <ExtensionPoint ext="navbar-logo">
            <Link to="/" className="navbar-brand">
              OSS Contribution Tracker
            </Link>
          </ExtensionPoint>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav ml-auto">
              {user.access.includes(AccessTypes.admin) && (
                <div className="collapse navbar-collapse">
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link">
                      Admin
                    </Link>
                  </li>
                  <li className="nav-item">
                    <ExtensionPoint ext="navbar-admin-links" user={user} />
                  </li>
                </div>
              )}
              <ExtensionPoint ext="navbar-links" user={user} />
              <li className="nav-item">
                <ExtensionPoint ext="navbar-contribution" user={user}>
                  <Link to="/contribute" className="nav-link">
                    Log Contribution
                  </Link>
                </ExtensionPoint>
              </li>
              <li className="nav-item">
                <Link to="/strategic-projects" className="nav-link">
                  Strategic Projects
                </Link>
              </li>
              <li className="nav-item">
                <div className="dropdown">
                  <button
                    className="btn btn-transparent dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Contributions
                  </button>
                  <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <a className="dropdown-item" href="/list">
                      Contributions By Project
                    </a>
                    <a className="dropdown-item" href="/employee">
                      Contributions By User
                    </a>
                  </div>
                </div>
              </li>
              <li className="nav-item">
                <div className="dropdown">
                  <button
                    className="btn btn-transparent dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Reports
                  </button>
                  <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {dropdownLinks}
                  </div>
                </div>
              </li>
            </ul>
            <ExtensionPoint ext="navbar-end" user={user} />
          </div>
        </nav>

        {generalError != null ? this.mapError(generalError) : ''}

        <div className="container-fluid mt-4">
          <div className="row">
            <div className="mx-auto col-lg-10">
              <Switch>
                <Route exact={true} path="/" component={Metrics} />
                <Route exact={true} path="/employee" component={Employee} />
                <Route exact={true} path="/list" component={List} />
                <Route
                  exact={true}
                  path="/strategic-projects"
                  component={Strategic}
                />
                <Route
                  exact={true}
                  path="/strategic-projects/group/:group_id"
                  component={Group}
                />
                <Route
                  exact={true}
                  path="/strategic-projects/project/:project_id"
                  component={Project}
                />
                <Route
                  exact={true}
                  path="/contribute"
                  component={Contributions}
                />
                <Route
                  exact={true}
                  path="/contribute/link"
                  component={GithubLinkUpdater}
                />
                <Route
                  exact={true}
                  path="/reports/:report_id"
                  component={Report}
                />
                {securedRoutes}
                <ExtensionPoint ext="routes-additional" />
              </Switch>
            </div>
          </div>

          <div className="row mt-4">
            <div className="mx-auto col-lg-10">
              <ExtensionPoint ext="footer" />
            </div>
          </div>
        </div>

        <ExtensionPoint ext="page-end" />
      </>
    );
  }
}

export default connect((state: { common: any }) => state.common)(App);
