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
import {Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis} from 'recharts';

interface Props {
  metricsDataByYear: any;
}

export default class SimpleLineChart extends React.Component<Props, {}> {
  stringToNumbers = () => {
    return this.props.metricsDataByYear
      .map((metric) => ({
        ...metric,
        total_contributions: parseInt(metric.total_contributions, 10),
      }));
  }

  render() {
    const data = this.stringToNumbers();
    return(
    <ComposedChart width={930} height={450} data={data}>
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Legend />
      <CartesianGrid stroke="#f5f5f5" />
      <Bar dataKey="total_contributions" barSize={20} fill="#413ea0" />
      <Line type="monotone" dataKey="project_count" stroke="#ff7300"  label="Project"/>
      <Line type="monotone" dataKey="contributor_count" stroke="#228B22"  label="Project"/>
    </ComposedChart>
    );
  }
}
