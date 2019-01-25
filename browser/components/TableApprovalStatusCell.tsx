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
import * as React from 'react';

interface Props {
  approval_status: string;
}

export default class TableApprovalStatusCell extends React.Component<
  Partial<Props>,
  {}
> {
  renderApprovalStatus(st) {
    let badge = '';
    const status = st.toLowerCase();
    if (status === 'denied') {
      badge = 'badge badge-danger';
    } else if (status === 'approved') {
      badge = 'badge badge-success';
    } else if (status === 'failure') {
      badge = 'badge badge-warning';
    } else {
      badge = 'badge badge-primary';
    }
    return (
      <div className="center">
        <span className={badge}>{status}</span>
      </div>
    );
  }
  render() {
    const result = this.props.approval_status ? (
      this.renderApprovalStatus(this.props.approval_status)
    ) : (
      <div />
    );
    return result;
  }
}
