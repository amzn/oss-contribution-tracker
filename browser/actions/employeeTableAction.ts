/* Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

export const RECEIVE_CONTRIBUTIONS_OF_SELECTED_USER = 'api/contributions/';

const initial = {};

export default function reducer(state = initial, action: any = {}) {
  switch (action.type) {
    case RECEIVE_CONTRIBUTIONS_OF_SELECTED_USER:
      return Object.assign({}, state, {
        filteredDataList: action.userContributions,
      });
    default:
      return state;
  }
}

// receiver functions
export function receiveUserContributions(currUserContributions) {
  return {
    type: RECEIVE_CONTRIBUTIONS_OF_SELECTED_USER,
    userContributions: filterContributionList(currUserContributions),
  };
}

// Action creators
export function fetchUserContribution(userName) {
  return dispatch => {
    return reqJSON(RECEIVE_CONTRIBUTIONS_OF_SELECTED_USER + userName).then(
      userContribution => {
        dispatch(receiveUserContributions(userContribution));
      }
    );
  };
}

// Helper functions
function filterContributionList(clist) {
  const list = new Array();
  Object.values<any>(clist.contributionList).map(array => {
    array.map(object => {
      list.push(object);
    });
  });
  return list;
}
