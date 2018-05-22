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
import { reqJSON } from '../util/index';

export const RECEIVE_CURRENT_USER = 'api/user';
export const RECEIVE_ALIAS_NAMES = 'api/contributions/alias';

const initial = {};

export default function reducer(state = initial, action: any = {}) {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return Object.assign({}, state, {
        user: action.currUser,
      });
    case RECEIVE_ALIAS_NAMES:
      return Object.assign({}, state, {
        aliasNames: action.aliasNames,
      });
    default:
      return state;
  }
}

// Receiver functions
export function receiveActiveUser(user) {
  return {
    type: RECEIVE_CURRENT_USER,
    currUser: user.user,
  };
}

export function receiveAliasNames(alias) {
  return {
    type: RECEIVE_ALIAS_NAMES,
    aliasNames: alias,
  };
}

// Action creators
export function fetchDataListAlias() {
  return dispatch => {
    return reqJSON(RECEIVE_ALIAS_NAMES).then(alias => {
      dispatch(receiveAliasNames(alias));
    });
  };
}

// Actions function fro getting the current user
export function fetchCurrentUser() {
  return dispatch => {
    return reqJSON(RECEIVE_CURRENT_USER).then(user => {
      dispatch(receiveActiveUser(user));
    });
  };
}
