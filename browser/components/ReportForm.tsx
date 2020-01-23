/* Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
import * as utils from '../util/generateReport';
import { reqJSON } from '../util/index';

interface Props {
  groupId: number;
  hideAlert: () => void;
}

interface State {
  years: any[];
}

export default class ReportForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
    };
  }

  async componentDidMount() {
    await this.getYears();
  }

  downloadReport = async e => {
    e.preventDefault();
    const fields = e.target.elements;
    const report = await reqJSON(
      `/api/strategic/report/${this.props.groupId}/${fields.year.value}-${fields.month.value}`
    );
    report.date = `${fields.year.value}-${fields.month.value}`;
    utils.onClickDownload(report);
    this.props.hideAlert();
  };

  getYears = async () => {
    const oldest = await reqJSON('/api/contributions/oldest');
    const current = new Date().getFullYear();
    const years = [];
    for (let i = current; i >= oldest.year; i--) {
      years.push(<option key={i}>{i}</option>);
    }
    this.setState({ years });
  };

  render() {
    return (
      <form onSubmit={this.downloadReport}>
        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="month">Select month</label>
            <select className="form-control" id="month">
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="form-group col">
            <label htmlFor="year">Select year</label>
            <select className="form-control" id="year">
              {this.state.years}
            </select>
          </div>
        </div>
        <div className="row justify-content-around">
          <button
            className="btn btn-warning btn-lg col-4"
            onClick={this.props.hideAlert}
          >
            {' '}
            Cancel{' '}
          </button>
          <button type="submit" className="btn btn-primary btn-lg col-4">
            {' '}
            Download{' '}
          </button>
        </div>
      </form>
    );
  }
}
