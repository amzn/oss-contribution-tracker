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
import {Cell} from 'fixed-data-table';
import * as React from 'react';

interface Props {
  rowIndex: number;
  field: any;
  data: any;
  col: any;
  columnKey: string;
}

interface State {
}

export default class TableLinkCell extends React.Component<Partial<Props>, State> {
  renderLink(link) {
    if (link) {
      return <a href={link}>Link</a>;
    }
  }

  render() {
    const {rowIndex, field, data, col, columnKey, ...props} = this.props;
    const link = data[rowIndex][field];
    return (
      <Cell {...props}>
        {this.renderLink(link)}
      </Cell>
    );
  }
}
