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

interface Props {
  usersAndCounts: any;
  contribCountByYearAll: any;
  topContribProjectsAllTime: any;
  topContribProjectsThisYear: any;
  topContribProjectsLastYear: any;
  allMetrics: any;
}

interface State {
}

export default class MetricsLists extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  metricsAll = () => {
    let list = this.props.allMetrics;
    return list.map(item => {
     return <li key={'allMetrics_' + item.year}> {item.year} : {item.total_contributions} contributions ({item.contributor_count} distinct contributors to {item.project_count} distinct projects) </li>;
    });
  }

  topProjectsByYear = (year, type) => {
    let list;
    if (type === 'cur') {
      list = this.props.topContribProjectsThisYear.slice(0, 10);
    } else if (type === 'last') {
      list = this.props.topContribProjectsLastYear.slice(0, 10);
    } else {
      list = [];
    }
    return list.map(item => {
      return <li key={'topProjectsByYear_' + item.project_name + item.count}>{item.count} - {item.project_name}</li>;
    });
  }

  topProjectsAllTime = () => {
    let list = this.props.topContribProjectsAllTime.slice(0, 10);
    return list.map(item => {
      return <li key={'topProjectsAllTime_' + item.project_name}>{item.count} - {item.project_name}</li>;
    });
  }

  topContributors = (list) => {
    return list ? list.map(item => {
      return <li key={'topContributors_' + item.alias}>{item.alias} | {item.count}</li>;
    }) : <div />;
  }

  render() {
    let metrics = this.metricsAll();
    let topProjectsAll = this.topProjectsAllTime();
    let curYear = new Date().getFullYear();
    return (
      <div>
      <div id="metrics">
        <h2>Metrics</h2>
        <h4>Contributions by Year</h4>
        <div id="chart">
        <SimpleLineChart metricsDataByYear ={this.props.allMetrics}/>
        </div>
        <ul>
          {metrics}
        </ul>
        <h4>Top Project Contributions ({curYear})</h4>
        <ul>
          {this.topProjectsByYear(curYear, 'cur')}
        </ul>

        <h4>Top Project Contributions ({curYear - 1})</h4>
        <ul>
          {this.topProjectsByYear(curYear - 1, 'last')}
        </ul>

        <h4>Top Project Contributions (all time)</h4>
        <ul>
          {topProjectsAll}
        </ul>

        <h4>Top Contributors 100+</h4>
        <ul>
          {this.topContributors(this.props.usersAndCounts.onehundo)}
        </ul>

        <h4>Top Contributors 50+</h4>
        <ul>
          {this.topContributors(this.props.usersAndCounts.fifty)}
        </ul>

        <h4>Top Contributors 20+</h4>
        <ul>
          {this.topContributors(this.props.usersAndCounts.twenty)}
        </ul>

        <h4>Top Contributors 10+</h4>
        <ul>
          {this.topContributors(this.props.usersAndCounts.ten)}
        </ul>
      </div>
      </div>
    );
  }
}