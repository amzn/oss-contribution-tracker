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

 import {ActionTypes} from '../actions/strategicActions';

 const initialState = {
   group: [],
   project: [],
 }

 const ContributionsReducer = (state = initialState, action) => {
   switch (action.type) {
     case ActionTypes.FETCH_GROUP_CONTRIBS: {
       const newState = {
         group: action.payload,
         project: state.project,
       }
       return newState;
     }
     case ActionTypes.FETCH_PROJECT_CONTRIBS: {
       const newState = {
         group: state.group,
         project: action.payload,
       }
       return newState;
     }
     default:
     return state;
   }
 };

 export default ContributionsReducer;
