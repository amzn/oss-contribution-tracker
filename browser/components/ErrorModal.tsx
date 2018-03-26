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
import { Component } from 'react';

interface Props {
  title: string;
  message: string;
  explain: string;
  onDismiss: any;
}

interface State {
}

export default class ErrorModal extends Component<Props, State> {
  render() {
    const { title, message, explain, onDismiss } = this.props;

    return (
      <div className="modal show" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{title}</h4>
            </div>
            <div className="modal-body">
              <p>There was a problem:<br/><strong>{message}</strong></p>
              <p>{explain}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={onDismiss}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
