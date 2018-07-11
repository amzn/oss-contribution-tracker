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

import { ActionTypes } from '../actions/strategicActions';

const initialState = {
  nav: '',
  group: 0,
};

const AdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_ADMIN_NAV: {
      const newState = {
        nav: action.payload,
        group: state.group,
      };
      return newState;
    }
    case ActionTypes.UPDATE_ADMIN_GROUP: {
      const newState = {
        nav: state.nav,
        group: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};

export default AdminReducer;
