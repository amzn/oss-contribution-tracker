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
import { Route, Router } from 'react-router-dom';

import history from './history';
import store from './store';

import App from './containers/App';

// routes listed here should point to redux-enabled containers
window.addEventListener('DOMContentLoaded', () => {
  render(
    <Provider store={store}>
      <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
        <Route component={App} />
      </Router>
    </Provider>,
    document.getElementById('content'),
  );
});

// @ts-ignore
// load up extensions (webpack hook)
const extCtx = (require as any).context('./extensions', false, /.ext.[jt]sx?$/);
extCtx.keys().forEach(extCtx);
