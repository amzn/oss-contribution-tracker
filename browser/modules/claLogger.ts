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
// tslint:disable:no-console

import { postJSON } from '../util/index';

// Actions

// New Cla
export function postNewCla(cla) {
  return dispatch => {
    return postJSON('/api/cla/submit', cla).catch(error =>
      console.error(error)
    );
  };
}

// update function for edit cla
export function updateCla(claUpdated) {
  return dispatch => {
    return postJSON('/api/cla/update', claUpdated).catch(error =>
      console.error(error)
    );
  };
}

// delete entries from cla
export function deleteClaEntry(id) {
  return dispatch => {
    return postJSON('/api/cla/delete', id).catch(error => console.error(error));
  };
}
