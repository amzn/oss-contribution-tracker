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

import RadzChart from '../components/RadzChart';

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
          {item.year}: {item.total_contributions} contributions ({
            item.contributor_count
          }{' '}
          distinct contributors to {item.project_count} distinct projects)
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

  topContributors = list => {
    return list ? (
      list.map(item => {
        return (
          <li key={'topContributors_' + item.alias}>
            {item.alias} | {item.count}
          </li>
        );
      })
    ) : (
      <div />
    );
  };

  render() {
    const metrics = this.metricsAll();
    const curYear = new Date().getFullYear();
    return (
      <div>
        <div id="metrics">
          <h2>Metrics</h2>
          <div className="row">
            <div className="col-4">
              <RadzChart
                data={this.getProcessedList(
                  this.props.topContribProjectsThisYear.slice(0, 10)
                )}
                centerText={curYear.toString()}
                height={400}
                width={600}
                id={'viz' + curYear.toString()}
                cornerRadius={0.3}
                padAngle={0.015}
                centerTextdx={'-1em'}
              />
            </div>
            <div className="col-4">
              <RadzChart
                data={this.getProcessedList(
                  this.props.topContribProjectsAllTime.slice(0, 10)
                )}
                centerText={'All Time'}
                height={500}
                width={750}
                id={'viz' + 'alltime'}
                cornerRadius={0.3}
                padAngle={0.015}
                centerTextSize={'70px'}
                centerTextdx={'-1.6em'}
              />
            </div>

            <div className="col-4">
              <RadzChart
                data={this.getProcessedList(
                  this.props.topContribProjectsLastYear.slice(0, 10)
                )}
                centerText={(curYear - 1).toString()}
                height={400}
                width={650}
                id={'viz' + (curYear - 1).toString()}
                cornerRadius={0.3}
                padAngle={0.015}
                centerTextdx={'-1em'}
              />
            </div>
          </div>
          <h4>Contributions by Year</h4>
          <div className="row" id="chart">
            <div className="col-6">
              <SimpleLineChart metricsDataByYear={this.props.allMetrics} />
            </div>
            <div className="col-4 center">
              <ul>{metrics}</ul>
            </div>
          </div>
          <h4>Top Contributors 100+</h4>
          <ul>{this.topContributors(this.props.usersAndCounts.onehundo)}</ul>

          <h4>Top Contributors 50+</h4>
          <ul>{this.topContributors(this.props.usersAndCounts.fifty)}</ul>

          <h4>Top Contributors 20+</h4>
          <ul>{this.topContributors(this.props.usersAndCounts.twenty)}</ul>

          <h4>Top Contributors 10+</h4>
          <ul>{this.topContributors(this.props.usersAndCounts.ten)}</ul>
        </div>
      </div>
    );
  }
}
