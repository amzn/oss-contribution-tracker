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
import { reqJSON } from '../util/index';

import MetricsLists from '../components/MetricsLists';

interface Props extends React.Props<any> {
}

interface State extends React.Props<any> {
  usersAndCounts: any;
  contribCountByYearAll: any;
  topContribProjectsAllTime: any;
  topContribProjectsThisYear: any;
  topContribProjectsLastYear: any;
  allMetrics: any;
}

export default class Metrics extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      usersAndCounts: {},
      contribCountByYearAll: [],
      topContribProjectsAllTime: [],
      topContribProjectsThisYear: [],
      topContribProjectsLastYear: [],
      allMetrics: [],
    };
  }

  componentWillMount() {
    reqJSON('/api/metrics/all').then(temp => {
      let topTenContributor = [], topTwentyContributor = [], topFiftyContributor = [], topOneHunderedContributor = [];
      // sorting into the groups I care about
      temp.usersAndCounts.forEach(function (item) {
        if (parseInt(item.count) >= 10 && parseInt(item.count) < 20) {
          topTenContributor.push(item);
        } else if (parseInt(item.count) >= 20 && parseInt(item.count) < 50) {
          topTwentyContributor.push(item);
        } else if (parseInt(item.count) >= 50 && parseInt(item.count) < 100) {
          topFiftyContributor.push(item);
        } else if (parseInt(item.count) >= 100) {
          topOneHunderedContributor.push(item)
        }
      });
      this.setState({
        allMetrics: temp.allMetrics,
        topContribProjectsLastYear: temp.topContribProjectsLastYear,
        topContribProjectsThisYear: temp.topContribProjectsThisYear,
        topContribProjectsAllTime: temp.topContribProjectsAllTime,
        contribCountByYearAll: temp.contribCountByYearAll,
        usersAndCounts: {
          ten: topTenContributor.reverse(),
          twenty: topTwentyContributor.reverse(),
          fifty: topFiftyContributor.reverse(),
          onehundo: topOneHunderedContributor.reverse(),
        },
      });
    });
  }

  render() {
    let content;
    if (this.state.allMetrics.length > 0) {
      content = (<MetricsLists
      usersAndCounts={this.state.usersAndCounts}
      contribCountByYearAll={this.state.contribCountByYearAll}
      topContribProjectsAllTime={this.state.topContribProjectsAllTime}
      topContribProjectsThisYear={this.state.topContribProjectsThisYear}
      topContribProjectsLastYear={this.state.topContribProjectsLastYear}
      allMetrics={this.state.allMetrics}
    />);
    } else {
      content = (
        <div id="metrics" className="jumbotron">
          <h1>No contributions logged.</h1>
        </div>);
    }
    return (
      <div className="container">
        { content }
      </div>
    );
  }
}