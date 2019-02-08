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
import pg from './index';

// tslint:disable:variable-name

// Select all approvers
export function listApprovers() {
  return pg().query('select * from approvers where approver_active = true');
}

// Select approvers by ID
export function searchApprovers(id) {
  return pg().query('select * from approvers where approver_id = $1', id);
}

export function getApproverByName(name) {
  return pg().one('select * from approvers where approver_alias = $1', [name]);
}
