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

export const SET_GENERAL_ERROR = 'app/common/set-general-error';
export const RECEIVE_USER_DATA = 'app/common/receive-user-data';

let initial = {
  generalError: null,
  claims: null,
};

export default function reducer(state = initial, action: any = {}) {
  switch (action.type) {
    case SET_GENERAL_ERROR:
      return Object.assign({}, state, {
        generalError: action.message,
      });

    case RECEIVE_USER_DATA:
      return Object.assign({}, state, {
        user: {
          name: action.user,
          groups: action.groups,
        },
      });

    default:
      return state;
  }
}

export function setGeneralError(message) {
  if (message != null) {
    console.log(message);
  }
  return {
    type: SET_GENERAL_ERROR,
    message: message,
  };
}

export function receiveUserData(user) {
  return {
    type: RECEIVE_USER_DATA,
    user,
  };
}

export function fetchUserData(query?: any) {
  return dispatch => {
    return reqJSON('/api/user').then(user => {
      dispatch(receiveUserData(user));
    });
  };
}