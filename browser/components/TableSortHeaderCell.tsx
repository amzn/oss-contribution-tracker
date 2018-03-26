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
  sortDir: string;
  onSortChange: any;
  columnKey?: string;
  height?: number;
  width?: number;
}

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

export default class TableSortHeaderCell extends React.Component<Props, {}> {
  onSortChange = (e) => {
    e.preventDefault();
    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ? reverseSortDirection(this.props.sortDir) : SortTypes.DESC,
      );
    }
  }

  render() {
    const {sortDir, children, columnKey, height, width} = this.props;
    return (
      <Cell columnKey={columnKey} height={height} width={width}>
        <a onClick={this.onSortChange} className="im-pointer">
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  }
}
