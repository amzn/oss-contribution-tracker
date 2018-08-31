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
import { CSVLink } from 'react-csv';
import ReactTable from 'react-table';
import { reqJSON } from '../util/index';

interface Props {
  params: any;
}

interface State {
  title: string;
  description: string;
  tables: Array<{
    title?: string;
    columns: Array<{
      name: string;
      db: string;
    }>;
    data: any[]; // this changes depending on the report
  }>;
}

export default class Report extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      tables: [],
    };
  }

  async componentDidMount() {
    const reportId = (this.props as any).match.params.report_id;
    const report = await reqJSON(`/api/reports/${reportId}`);
    if (report.title != null) {
      this.setState({
        title: report.title,
        description: report.description,
        tables: report.tables,
      });
    }
  }

  buildColumns = table => {
    const columns = [];
    for (const column of Object.keys(table.data[0])) {
      columns.push({
        Header: <b>{column}</b>,
        accessor: column,
      });
    }
    return columns;
  };

  buildTables = () => {
    const tables = [];
    for (const table of this.state.tables) {
      if (table.data.length) {
        const id = this.state.tables.indexOf(table);
        tables.push(
          <div key={id}>
            <div className="group-header">
              <h6> {table.title} </h6>
              <CSVLink
                data={this.state.tables[id].data}
                filename={`${table.title || this.state.title}.csv`}
              >
                <button className="btn btn-primary btn-sm">
                  <i className="fa fa-download" /> Download CSV
                </button>
              </CSVLink>
            </div>
            <br />
            <div id="contributions_table_admin">
              <ReactTable
                data={table.data}
                columns={this.buildColumns(table)}
                defaultPageSize={5}
                className="-striped -highlight"
                filterable={true}
              />
            </div>
            <br />
          </div>
        );
      } else {
        tables.push(
          <div key={this.state.tables.indexOf(table)}>
            <h6> {table.title} </h6>
            <p> There are no results for this specific query. </p>
            <br />
          </div>
        );
      }
    }
    return tables;
  };

  render() {
    const tables = this.buildTables();
    if (this.state.title) {
      return (
        <div>
          <h3> {this.state.title} </h3>
          <p> {this.state.description} </p>
          <hr />
          {tables}
        </div>
      );
    } else {
      return (
        <p>
          This report does not exist. Please select the proper report from the
          dropdown.
        </p>
      );
    }
  }
}
