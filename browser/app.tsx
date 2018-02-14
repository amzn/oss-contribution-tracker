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
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, IndexRoute, Route, Router } from 'react-router';
import store from './store';

import Admin from './containers/Admin';
import App from './containers/App';
import Approvals from './containers/Approvals';
import Contributions from './containers/Contributions';
import EditCLA from './containers/EditCla';
import EditContribution from './containers/EditContribution';
import Employee from'./containers/Employee';
import GithubLinkUpdater from './containers/GithubLinkUpdater';
import List from './containers/List';
import Metrics from './containers/Metrics';

// routes listed here should point to redux-enabled containers
window.addEventListener('DOMContentLoaded', () => {
  render(
    <Provider store={store}>
      <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Metrics} />
          <Route path="employee" component={Employee} />
          <Route path="list" component={List} />
          <Route path="admin" component={Admin} />
          <Route path="cla/:project_id" component={EditCLA} />
          <Route path="contribute" component={Contributions}  />
          <Route path="approvals/:contrib_id" component={Approvals} />
          <Route path="contribution/:contrib_id" component={EditContribution} />
          <Route path="metrics" component={Metrics}/>
          <Route path="contribute/link" component={GithubLinkUpdater}/>
        </Route>
      </Router>
    </Provider>,
    document.getElementById('content'),
  );
});

// @ts-ignore
// load up extensions (webpack hook)
const extCtx = (require as any).context('./extensions', false, /.ext.[jt]sx?$/);
extCtx.keys().forEach(extCtx);