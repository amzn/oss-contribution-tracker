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

interface Props extends React.Props<any> {
  diff: any;
}

interface State extends React.Props<any> {
}

export default class DiffDiv extends React.Component<Props, State>{
  getLineAsListItem = (line) => {
    if (line.charAt(0) === '+' && line.charAt(1) !== '+') {
      return(<li className="diff-green">{line}</li>);
    }	else if (line.charAt(0) === '-' && line.charAt(1) !== '-') {
      return(<li className="diff-red">{line}</li>);
    } else {
      return(<li className="diff-grey">{line}</li>);
    }
  }

  render() {
    if (this.props.diff != null) {
      return(
        <div className="diff-container">
          <ul className="ul-nopadding">
            {this.props.diff.map(line => this.getLineAsListItem(line))}
          </ul>
        </div>
      );
    }
    return(<div className="diff-container"><h4>Please provide the diff file to proceed to the next step</h4></div>);
  }
}