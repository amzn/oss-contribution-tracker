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
import { Cell } from 'fixed-data-table';
import * as React from 'react';

interface Props extends React.Props<any> {
  rowIndex: number;
  field: any;
  data: any;
  col: any;
  columnKey: string;
}

export default class TableSummaryCell extends React.Component<Partial<Props>, {}> {
  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    $('[data-toggle="popover"]').popover({ container: 'body' });
  }

  shortner = (text) => {
    // checks if text is over 50 characters and adds tool tip for full text
    if (text && text.length > 50) {
      return(
        <span>
          {text.substring(0, 47)} <a tabIndex={0} data-toggle="popover" data-trigger="hover"
            data-placement="right" title="Contribution Summary" data-content={text}>...</a>
        </span>
      );
    } else {
      return text;
    }
  }

  render() {
    const {rowIndex, field, data, col, columnKey, ...props} = this.props;

    // Shorten alows for more flexibitly in reusing this component
    return (
      <Cell {...props}>
        {this.shortner(data[rowIndex][field]) }
      </Cell>
    );
  }
}
