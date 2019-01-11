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
import SimpleLineChart from '../components/SimpleLineChart';

import RadzChart from '../components/DonutChart';

interface Props {
  usersAndCounts: any;
  contribCountByYearAll: any;
  topContribProjectsAllTime: any;
  topContribProjectsThisYear: any;
  topContribProjectsLastYear: any;
  allMetrics: any;
}

export default class MetricsLists extends React.Component<Props, {}> {
  metricsAll = () => {
    const list = this.props.allMetrics;
    return list.map(item => {
      return (
        <li key={'allMetrics_' + item.year}>
          {item.year}: {item.total_contributions} contributions (
          {item.contributor_count} distinct contributors to {item.project_count}{' '}
          distinct projects)
        </li>
      );
    });
  };

  getProcessedList(list) {
    return list.map(value => {
      return {
        label: value.project_name,
        value: value.count,
      };
    });
  }

  render() {
    const curYear = new Date().getFullYear();
    return (
      <div id="metrics">
        <h2>Metrics</h2>
        <div>
          <div className="row">
            <div className="col">
              <div className="float-left">
                <RadzChart
                  data={this.getProcessedList(
                    this.props.topContribProjectsThisYear.slice(0, 10)
                  )}
                  centerText={curYear.toString()}
                  height={150}
                  width={450}
                  id={'viz' + curYear.toString()}
                  cornerRadius={0.3}
                  padAngle={0.015}
                  centerTextSize={'20px'}
                  centerTextdx={'-1em'}
                />
              </div>
              <div className="float-right">
                <RadzChart
                  data={this.getProcessedList(
                    this.props.topContribProjectsLastYear.slice(0, 10)
                  )}
                  centerText={(curYear - 1).toString()}
                  height={150}
                  width={450}
                  id={'viz' + (curYear - 1).toString()}
                  cornerRadius={0.3}
                  padAngle={0.015}
                  centerTextSize={'20px'}
                  centerTextdx={'-1em'}
                />
              </div>
            </div>

            <div className="col">
              <RadzChart
                data={this.getProcessedList(
                  this.props.topContribProjectsAllTime.slice(0, 10)
                )}
                centerText={'All Time'}
                height={300}
                width={550}
                id={'vizalltime'}
                cornerRadius={0.3}
                padAngle={0.015}
                centerTextSize={'30px'}
                centerTextdx={'-1.7em'}
              />
            </div>

            <div className="col" id="chart">
              <SimpleLineChart metricsDataByYear={this.props.allMetrics} />
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}
